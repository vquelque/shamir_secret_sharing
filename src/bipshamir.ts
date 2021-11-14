import { mnemonicToEntropy, entropyToMnemonic } from "bip39";
import { PolynomialGF256 } from "./math/polynomial";
import { hexStringToUint8Array, leftPad } from "./utils/hex";
import { BIPShares, encodedShares, share } from "./types/bipshares";
import { lagrange } from "./math/lagrange";
import { config } from "./constants/config";

export class BIPShamir {
  numShares: number;
  minRecovery: number;
  wordList: Set<string>;

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
      console.error("wrong Shamir parameters");
      return null;
    }
    this.numShares = numShares;
    this.minRecovery = minRecovery;
  }

  createShares(mnemonic: string) {
    const secret = mnemonicToEntropy(mnemonic);
    const hexShares = this.splitHex(secret);
    const mnemonicShares = Object.keys(hexShares).reduce((accum, id) => {
      const mnemonicShare = entropyToMnemonic(hexShares[id]);
      accum.push({ x: id, y: mnemonicShare });
      return accum;
    }, []);
    const encodedShares = this.createEncodedShares(mnemonicShares);
    return encodedShares;
  }

  static recoverSecret(shares: encodedShares) {
    const [decodedShares, _ , minRecovery] = this.decodeEncodedShares(shares);
    const numShares = decodedShares.length
    if (numShares< minRecovery) {
      throw new Error(`Not enough shares to recover the secret ! You provided ${numShares} shares but you need at least ${minRecovery} shares\n`)
    }
    const recoveredEntropy = this.recoverMnemonicFromShares(decodedShares)
    const recoveredMnemonic = entropyToMnemonic(recoveredEntropy)
    return recoveredMnemonic
  }

  private static recoverMnemonicFromShares(shares: BIPShares) {
    // x coordinatex of shares
    const x: number[] = [];
    // y coordinates of points to interpolate
    const y: number[][] = [];

    shares.forEach((share, i) => {
      const entropy = hexStringToUint8Array(mnemonicToEntropy(share.y));
      const x_share = parseInt(share.x, 10);
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

  // split secret into parts. Returns an arary of (x,y) pairs representing the polynomial
  // evaluated at random (x,y) points
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

    const sharesHex = pointsByShare.reduce((accum, curr) => {
      curr.forEach((share) => {
        if (!accum[share.x]) {
          accum[share.x] = share.y;
        } else {
          accum[share.x] += share.y;
        }
      });
      return accum;
    }, {});
    return sharesHex;
  }

  // encode the x coordinate and the version of the protocol to the share
  private createEncodedShares(secret: BIPShares) {
    const version = config.VERSION;
    return secret.map((share) => {
      const v_string = `V${leftPad(version.toString(16), "0", 2)}M${leftPad(
        this.minRecovery.toString(16),
        "0",
        2
      )}P${leftPad(share.x, "0", 2)}`;
      return `${v_string} ${share.y}`;
    });
  }

  private static decodeEncodedShares(encodedShares: encodedShares) {
    let version
    let minRecovery
    const decodedShares = encodedShares.map((encodedShare) => {
      const reg = /V([0-9A-F]{2})M([0-9A-F]{2})P([0-9A-F]{2})\s((?:\w+\s?){15})/;
      const splittedShare = encodedShare.match(reg);
      if (!splittedShare) {
        throw new TypeError("encoded share is not valid");
      }
      const _version = parseInt(splittedShare[1], 16);
      const _minRecovery = parseInt(splittedShare[2],16)
      version = version ? version : _version
      minRecovery = minRecovery ? minRecovery : _minRecovery
      if (_version != version) {
        throw new Error("Shares versions do not match !")
      }
      if (_minRecovery != minRecovery) {
        throw new Error("Shares recovery threshold do not match !")
      }
      const x = parseInt(splittedShare[3], 16);
      const bipShare = splittedShare[4];
      return {x: x, y:bipShare}
    });
    return [decodedShares, version, minRecovery]
  }
}
