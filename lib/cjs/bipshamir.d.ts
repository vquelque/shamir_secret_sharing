import { encodedShares } from "./types/bipshares";
export declare class BIPShamir {
    numShares: number;
    minRecovery: number;
    /**
     * Constructs a new Shamir's secret sharing model splitting the secret into `numShares` and requiring
     * `minRecovery` shares to recover
     * @param numShares
     * @param minRecovery
     * @returns
     */
    constructor(numShares: number, minRecovery: number);
    createShares(mnemonic: string): string[];
    static recoverSecret(shares: encodedShares): string;
    private static recoverMnemonicFromShares;
    private splitHex;
    private createEncodedShares;
    private static decodeEncodedShares;
}
