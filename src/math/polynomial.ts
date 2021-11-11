import { leftPad } from "../utils/hex";
import * as GF256 from "./gf256";
import { randomBytes } from "crypto";

// Represents a polynomial in GF256 Field
export class PolynomialGF256 {
  coefficients: Uint8Array;
  degree: number;

  constructor(coefficients: Uint8Array) {
    this.coefficients = coefficients;
    this.degree = this.coefficients.length - 1;
  }

  evaluate(x: number) {
    let res = this.coefficients[0];
    for (let i = 1; i <= this.degree; ++i) {
        res = GF256.add(GF256.mul(x, res), this.coefficients[i]);
    }
    return res;
  }

  static getRandomPoly(degree: number, coefficients: Uint8Array) {
    if (degree > 255) {
      console.error("cannot create a polynomial with degree bigger than the field")
      degree = 255
    }
    const providedCoeffsLength = coefficients ? coefficients.length : 0;
    // generate random coefficients
    const randomCoeffs = new Uint8Array(degree - providedCoeffsLength)
      .fill(0)
      .map(() => {
        const b = randomBytes(1);
        return parseInt(b.toString("hex"), 16);
      });
    const polyCoeffs = coefficients
      ? new Uint8Array([...randomCoeffs, ...coefficients])
      : coefficients;
    return new PolynomialGF256(polyCoeffs);
  }
}
