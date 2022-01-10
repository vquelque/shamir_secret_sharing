import { EncodedShares } from "./types/bipshares";
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
    /**
     * Creates the shamir shares from the provided mnemonic
     * @argument mnemonic: BIP-39 mnemonic using english wordlist
     * encoded as a space-separated string
     * @returns EncodedShares: an array of shares encoded as string
     */
    createShares(mnemonic: string): EncodedShares;
    /**
     * Recover original mnemonic from previously generated shares
     * @param shares: Array of shares encoded as string
     * @returns Original BIP-39 mnemonic (secret)
     */
    static recoverSecret(shares: EncodedShares): string;
    /**
     * Recover the entropy from shares
     * @param shares
     * @returns
     */
    private static recoverEntropyFromShares;
    /**
     * Split a secet into parts. Return an array of (x,y) pairs representing the random polynomial
     * evaluated at points (x,y)
     * @param secret
     * @returns
     */
    private splitHex;
    /**
     * Encode the version of the protocol, the minimal number of shares needed to recover
     * and the point used to evalute the share. Should output `VxxMxxPxx <mnemonic>`
     * @param x: point used to evaluate the share
     * @param mnemonic: share mnemonic
     * @returns encoded share
     */
    private encodeShare;
    /**
     * Decode the encodedShare
     * @param encodedShares
     * @returns
     */
    private static decodeEncodedShares;
}
