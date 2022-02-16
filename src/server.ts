import "dotenv/config";
import { switchMap, filter, of, catchError } from "rxjs";
import ws from "ws";
import { assetFromToken, getApiCreator } from "@equilab/api";
import { Header } from "@polkadot/types/interfaces";
import { cryptoWaitReady, mnemonicGenerate } from "@polkadot/util-crypto";
import Keyring from "@polkadot/keyring";

import { ClientAction, Message } from "./types";
import { send, getId, decodeMessage, handleTx } from "./utils";
import { TRANSFER_PRECISION, PORT, CHAIN_NODE, SEED_PHRASE } from "./constants";

let keyring: Keyring | undefined = undefined;
let latestHead: Header | undefined = undefined;

const server = new ws.Server({ port: +PORT });
const api$ = getApiCreator("Gens", "rxjs")(CHAIN_NODE);

api$
	.pipe(switchMap((api) => api._api.rpc.chain.subscribeNewHeads()))
	.subscribe({
		next: (head) => {
			latestHead = head;
		},
		error: (err) => {
			console.error(err);
		},
	});

const actionDispatch = async (id: string, client: ws, message: Message) => {
	switch (message.action) {
		case ClientAction.createSeed:
			const seed = mnemonicGenerate(12);
			send(id, client, seed);
			break;
		case ClientAction.getLatestBlockHead:
			send(
				id,
				client,
				latestHead ?? { error: "Block heads subscription failed" }
			);
			break;

		case ClientAction.getBlockEvents:
			if (!message.data || typeof message.data.blockNumber !== "number") {
				send(id, client, { error: "Wrong data in request" });
				return;
			}

			const blockEventsSubscription = api$
				.pipe(
					switchMap((api) =>
						api._api.rpc.chain
							.getBlockHash(message.data.blockNumber)
							.pipe(switchMap((hash) => api._api.query.system.events.at(hash)))
					)
				)
				.subscribe({
					next: (data) => {
						send(id, client, { data });
						blockEventsSubscription.unsubscribe();
					},
					error: (err) => {
						console.error(err);
						blockEventsSubscription.unsubscribe();
					},
				});

			break;

		case ClientAction.getBalance:
			if (
				!message.data ||
				!message.data.token ||
				typeof message.data.token !== "string" ||
				typeof message.data.address !== "string"
			) {
				send(id, client, { error: "Wrong data in request" });
				return;
			}

			const balanceAsset = assetFromToken(message.data.token);

			const balanceSubscription = api$
				.pipe(
					switchMap((api) =>
						api._api.query.eqBalances.account(
							message.data.address,
							// @ts-expect-error
							balanceAsset
						)
					)
				)
				.subscribe({
					next: (balance) => {
						send(id, client, balance);
						balanceSubscription.unsubscribe();
					},
					error: (err) => {
						send(id, client, { error: err });
						balanceSubscription.unsubscribe();
					},
				});
			break;

		case ClientAction.transfer:
			if (
				!message.data ||
				!message.data.token ||
				typeof message.data.token !== "string" ||
				typeof message.data.to !== "string" ||
				typeof message.data.amount !== "number"
			) {
				send(id, client, { error: "Wrong data in request" });
				return;
			}

			const transferAsset = assetFromToken(message.data.token);
			const transferAmount = TRANSFER_PRECISION.times(
				message.data.amount
			).toString();

			const transferPair = keyring?.getPairs()?.[0];

			if (!transferPair) {
				send(id, client, { success: false, error: "Keyring not found" });
				return;
			}

			const transferSubscription = api$
				.pipe(
					switchMap((api) =>
						api._api.tx.eqBalances
							.transfer(
								// @ts-expect-error
								transferAsset,
								message.data.to,
								transferAmount
							)
							.signAndSend(transferPair, {
								nonce: -1,
							})
							.pipe(
								filter((res) => res.isFinalized || res.isInBlock),
								handleTx(api._api)
							)
					)
				)
				.subscribe({
					next: () => {
						send(id, client, { success: true });
						transferSubscription.unsubscribe();
					},
					error: (e) => {
						send(id, client, { success: false, error: e });
						transferSubscription.unsubscribe();
					},
				});

			break;

		default:
			send(id, client, { error: "Wrong message recieved" });
			break;
	}
};

console.info("Initializing keyring...");
cryptoWaitReady()
	.then(() => {
		keyring = new Keyring();
		keyring.addFromMnemonic(SEED_PHRASE, {}, "sr25519");
		console.info("Keyring initialized");
	})
	.catch((e) => {
		console.error("Failed to initialize keyring. Shutting down");
		process.exit();
	});

server.on("connection", (client) => {
	client.send("Example api service connected");

	client.on("message", async (clientMessage) => {
		const message = decodeMessage(clientMessage);

		const id = getId();
		send(id, client, message);

		await actionDispatch(id, client, message);
	});
});
