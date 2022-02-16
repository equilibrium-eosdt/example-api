import type { RegistryError } from "@polkadot/types/types";

export enum ClientAction {
	getLatestBlockHead = "getLatestBlockHead",
	getBlockEvents = "getBlockEvents",
	getBalance = "getBalance",
	createSeed = "createSeed",
	transfer = "transfer",
	unknown = "unknown",
}

export interface Message {
	action: ClientAction;
	data?: any;
}

export class TxError extends Error {
	public registryErrors: RegistryError[];

	constructor(message: string, errors: RegistryError[]) {
		super(message);
		this.registryErrors = errors;
	}
}
