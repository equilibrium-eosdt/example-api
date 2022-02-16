import BigNumber from "bignumber.js";
import { ClientAction } from "./types";

export const PORT = process.env.PORT || 9000;
export const CHAIN_NODE = process.env.CHAIN_NODE || "wss://devnet.genshiro.io";
export const SEED_PHRASE = process.env.SEED_PHRASE || "";

export const TRANSFER_PRECISION = new BigNumber(1e9);

export const UNKNOWN_MESSAGE = { action: ClientAction.unknown };

console.assert(
	Boolean(process.env.PORT),
	`Env var PORT not found. Using default ${PORT}`
);

if (SEED_PHRASE.length === 0 || SEED_PHRASE.split(" ").length !== 12) {
	console.error("No valid seed phrase found. Shutting service down");
	process.exit();
}
