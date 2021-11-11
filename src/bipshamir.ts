import {mnemonicToEntropy, entropyToMnemonic} from "bip39"
import {PolynomialGF256 } from "./math/polynomial"
import {hexToIntVector, leftPad} from "./utils/hex"
import {share, BIPShares} from "./types/bipshares"
import { lagrange } from "./math/lagrange"


export class BIPShamir {
    numShares: number
    minRecovery: number
    wordList: Set<string>
    
    constructor(numShares: number, minRecovery: number) {
        if (numShares < 2 || minRecovery < 2 || minRecovery > 10 || numShares > 10 || minRecovery > numShares) {
            console.error("wrong Shamir parameters");
            return null;
        }
        this.numShares = numShares
        this.minRecovery = minRecovery
    }

    createShares (mnemonic: string) {
       // 1. Split mnemonic
       // 2. Validate mnemonic
       // 3. Generate shares
       //TODO! Check that public key derived from private key matches public key of the account
       //this.validateBIP39(mnemonic) 
       const secret = mnemonicToEntropy(mnemonic)
       const shares = this.splitHex(secret)
       return Object.keys(shares).reduce((accum, id) => {
       const mnemonicShare = entropyToMnemonic(shares[id]);
       accum.push({x: id,y: mnemonicShare})
      return accum;
      }, [])
    }

    validateBIP39(mnemonic: string[]): boolean {
        return mnemonic.reduce<boolean>((acc: boolean, word: string) => this.wordList.has(word) && acc, true)
    }

    // split secret into parts. Returns an arary of (x,y) pairs representing the polynomial
    // evaluated at random (x,y) points
    private splitHex(secret: string) {
        //for each integer in the secret
        const pointsByShare = hexToIntVector(secret).map(s => {

            //polynomial of degree "num shares" with the secret as the constant
            const polynomial =  PolynomialGF256.getRandomPoly(this.minRecovery,new Uint8Array([s]))
            //evalute polynomial in GF256 to create the shares
            return Array(this.numShares).fill(0).map((_, index) => {
              const x = index + 1; //f(0) is the secret
              const y = polynomial.evaluate(x)
              const hexY = leftPad(y.toString(16), '0', 2);
              return { x: x.toString(), y: hexY };
            });
            })
    

        const sharesHex = pointsByShare.reduce((accum, curr) => {
            curr.forEach(share => {
              if (!accum[share.x]) {
                accum[share.x] = share.y;
              } else {
                accum[share.x] += share.y;
              }
            });
            return accum;
          }, {});
        return sharesHex
    }

    recoverMnemonicFromShares(shares: BIPShares) {
      // x coordinatex of shares
      const x: number[] = [];
      // y coordinates of points to interpolate 
      const y: number[][] = [];
      
      shares.forEach((share,i) => {
        const entropy = hexToIntVector(mnemonicToEntropy(share.y))
        const x_share = parseInt(share.x,10)
        x.push(x_share)
        entropy.forEach((n,j) => {
          if (!y[j]) {
            y[j] = []
          }
          y[j][i] = n
        })
      }) 
      return y.map(part => lagrange(0, x, part))
      .reduce((accum, part) => {
        const partHex = leftPad(part.toString(16), '0', 2);
        return accum + partHex;
      }, '');
    }

}
