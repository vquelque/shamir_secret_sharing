import * as GF256 from "./gf256";
import { randomBytes } from "crypto";

// Represents a polynomial in Galois Field GF256
export class PolynomialGF256 {
  coefficients: Uint8Array;
  degree: number;

  /**
   * Construct a polynomial in GF256
   * @param coefficients 
   */
  constructor(coefficients: Uint8Array) {
    this.coefficients = coefficients;
    this.degree = this.coefficients.length - 1;
  }

  /**
   * Evaluate the polynomial at point x
   * @param x 
   * @returns result of the evaluation of the polynomial at point x
   */
  evaluate(x: number) {
    GF256.checkRange(x)
    let res = this.coefficients[0];
    for (let i = 1; i <= this.degree; ++i) {
        res = GF256.add(GF256.mul(x, res), this.coefficients[i]);
    }
    return res;
  }

  /**
   * Returns a (partly)random polynomial of degree `degree` initialized 
   * with coefficients `coefficients` in GF256
   * @param degree integer < 255
   * @param coefficients array of Uint8 representing coefficients in GF256 used to 
   * initialize the polynomial starting from the highest degree to the 
   * lowest degree. If len(coefficients) < degree, the additional
   * coefficients will be randomly generated
   * @returns the polynomial
   */
  static getRandomPoly(degree: number, coefficients?: Uint8Array) {
    if (degree > 255) {
      throw new RangeError("cannot create a polynomial with degree bigger than the field")
    }
    const providedCoeffsLength = coefficients !== undefined ? coefficients.length : 0;
    // generate random coefficients
    const randomCoeffs = new Uint8Array(degree + 1 - providedCoeffsLength)
      .fill(0)
      .map(() => {
        const b = randomBytes(1);
        return parseInt(b.toString("hex"), 16);
      });
    const polyCoeffs = coefficients
      ? new Uint8Array([...randomCoeffs, ...coefficients])
      : randomCoeffs;
    return new PolynomialGF256(polyCoeffs);
  }
}
