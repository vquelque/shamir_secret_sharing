"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PolynomialGF256 = void 0;
const GF256 = __importStar(require("./gf256"));
const crypto_1 = require("crypto");
// Represents a polynomial in Galois Field GF256
class PolynomialGF256 {
    /**
     * Construct a polynomial in GF256
     * @param coefficients
     */
    constructor(coefficients) {
        this.coefficients = coefficients;
        this.degree = this.coefficients.length - 1;
    }
    /**
     * Evaluate the polynomial at point x
     * @param x
     * @returns result of the evaluation of the polynomial at point x
     */
    evaluate(x) {
        GF256.checkRange(x);
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
    static getRandomPoly(degree, coefficients) {
        if (degree > 255) {
            throw new RangeError("Cannot create a polynomial with degree bigger than the field");
        }
        const providedCoeffsLength = coefficients !== undefined ? coefficients.length : 0;
        // generate random coefficients
        const randomCoeffs = new Uint8Array(degree + 1 - providedCoeffsLength)
            .fill(0)
            .map(() => {
            const b = (0, crypto_1.randomBytes)(1);
            return parseInt(b.toString("hex"), 16);
        });
        const polyCoeffs = coefficients
            ? new Uint8Array([...randomCoeffs, ...coefficients])
            : randomCoeffs;
        return new PolynomialGF256(polyCoeffs);
    }
}
exports.PolynomialGF256 = PolynomialGF256;
