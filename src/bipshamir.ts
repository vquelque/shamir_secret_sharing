import { mnemonicToEntropy, entropyToMnemonic } from "bip39";
import { PolynomialGF256 } from "./math/polynomial";
import { hexStringToUint8Array, leftPad } from "./utils/hex";
import {
  BIPShares,
  EncodedShares,
  Entropy,
  Share,
  ShareMnemonic,
} from "./types/bipshares";
import { lagrange } from "./math/lagrange";
import { config } from "./constants/config";

export class BIPShamir {
  numShares: number;
  minRecovery: number;

  /**
   * Constructs a new Shamir's secret sharing model splitting the secret into `numShares` and requiring
   * `minRecovery` shares to recover
   * @param numShares
   * @param minRecovery
   * @returns
   */
  constructor(numShares: number, minRecovery: number) {
    if (
      numShares < config.MIN_NUMBER_OF_SHARES ||
      numShares > config.MAX_NUMBER_OF_SHARES ||
      minRecovery < config.MIN_RECOVERY ||
      minRecovery > numShares
    ) {
      throw new Error("wrong Shamir parameters");
    }
    this.numShares = numShares;
    this.minRecovery = minRecovery;
  }

  /**
   * Creates the shamir shares from the provided mnemonic
   * @argument mnemonic: BIP-39 mnemonic using english wordlist
   * encoded as a space-separated string
   * @returns EncodedShares: an array of shares encoded as string
   */
  public createShares(mnemonic: string): EncodedShares {
    const secret = mnemonicToEntropy(mnemonic);
    const hexShares = this.splitHex(secret);

    const encodedShares = [];

    for (const x in hexShares) {
      const mnemonicShare = entropyToMnemonic(hexShares[x]);
      const encShare = this.encodeShare(x, mnemonicShare);
      encodedShares.push(encShare);
    }

    return encodedShares;
  }

  /**
   * Recover original mnemonic from previously generated shares
   * @param shares: Array of shares encoded as string
   * @returns Original BIP-39 mnemonic (secret)
   */
  public static recoverSecret(shares: EncodedShares): string {
    const [decodedShares, _, minRecovery] = this.decodeEncodedShares(shares);
    const numShares = decodedShares.length;
    if (numShares < minRecovery) {
      throw new Error(
        `Not enough shares to recover the secret ! You provided ${numShares} shares but you need at least ${minRecovery} shares\n`
      );
    }
    const recoveredEntropy = this.recoverEntropyFromShares(decodedShares);
    const recoveredMnemonic = entropyToMnemonic(recoveredEntropy);
    return recoveredMnemonic;
  }

  /**
   * Recover the entropy from shares
   * @param shares
   * @returns
   */
  private static recoverEntropyFromShares(shares: BIPShares): Entropy {
    // x coordinatex of shares
    const x: number[] = [];
    // y coordinates of points to interpolate
    const y: number[][] = [];

    shares.forEach((share, i) => {
      const entropy = hexStringToUint8Array(mnemonicToEntropy(share.y));
      const x_share = parseInt(share.x, 16);
      x.push(x_share);
      entropy.forEach((n, j) => {
        if (!y[j]) {
          y[j] = [];
        }
        y[j][i] = n;
      });
    });
    return y
      .map((part) => lagrange(0, x, part))
      .reduce((accum, part) => {
        const partHex = leftPad(part.toString(16), "0", 2);
        return accum + partHex;
      }, "");
  }

  /**
   * Split a secet into parts. Return an array of (x,y) pairs representing the random polynomial
   * evaluated at points (x,y)
   * @param secret
   * @returns
   */
  private splitHex(secret: string) {
    //for each integer in the secret
    const pointsByShare = hexStringToUint8Array(secret).map((s) => {
      //polynomial of degree "num shares - 1" with the secret as the constant
      const polynomial = PolynomialGF256.getRandomPoly(
        this.minRecovery - 1,
        new Uint8Array([s])
      );
      //evalute polynomial in GF256 to create the shares
      return Array(this.numShares)
        .fill(0)
        .map((_, index) => {
          const x = index + 1; //f(0) is the secret
          const y = polynomial.evaluate(x);
          const hexY = leftPad(y.toString(16), "0", 2);
          return { x: x.toString(16), y: hexY };
        });
    });

    // Concatenate individual points to create the hex shares
    const sharesHex = pointsByShare.reduce<Record<string, string>>(
      (accum, curr) => {
        curr.forEach((share: Share) => {
          if (!accum[share.x]) {
            accum[share.x] = share.y;
          } else {
            accum[share.x] += share.y;
          }
        });
        return accum;
      },
      {}
    );
    return sharesHex;
  }

  /**
   * Encode the version of the protocol, the minimal number of shares needed to recover
   * and the point used to evalute the share. Should output `VxxMxxPxx <mnemonic>`
   * @param x: point used to evaluate the share 
   * @param mnemonic: share mnemonic
   * @returns encoded share
   */
  private encodeShare(x: string, mnemonic: string): ShareMnemonic {
    const version = config.VERSION;
    const v_string = `V${leftPad(version.toString(16), "0", 2)}M${leftPad(
      this.minRecovery.toString(16),
      "0",
      2
    )}P${leftPad(x, "0", 2)}`;
    return `${v_string} ${mnemonic}`;
  }

  /**
   * Decode the encodedShare
   * @param encodedShares 
   * @returns 
   */
  private static decodeEncodedShares(
    encodedShares: EncodedShares
  ): [Array<Share>, number, number] {
    let version = -1;
    let minRecovery = -1;

    const decodedShares = encodedShares.reduce<Record<string, Share>>(
      (acc, encodedShare) => {
        const reg =
          /V([0-9A-F]{2})M([0-9A-F]{2})P([0-9A-F]{2})\s((?:\w+\s?){15})/;
        const splittedShare = encodedShare.match(reg);
        if (!splittedShare) {
          throw new TypeError("encoded share is not valid");
        }
        const _version = parseInt(splittedShare[1], 16);
        const _minRecovery = parseInt(splittedShare[2], 16);
        if (version < 0) {
          version = _version;
        }
        minRecovery = minRecovery > 0 ? minRecovery : _minRecovery;
        if (version !== _version) {
          throw new Error("Shares versions do not match !");
        }
        if (_minRecovery !== minRecovery) {
          throw new Error("Shares recovery threshold do not match !");
        }
        const x = splittedShare[3];
        const bipShare = splittedShare[4];
        const share = { x: x, y: bipShare };
        if (!acc[x]) {
          acc[x] = share;
        }
        return acc;
      },
      {}
    );
    return [Object.values(decodedShares), version, minRecovery];
  }
}
