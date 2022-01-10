export declare class PolynomialGF256 {
    coefficients: Uint8Array;
    degree: number;
    /**
     * Construct a polynomial in GF256
     * @param coefficients
     */
    constructor(coefficients: Uint8Array);
    /**
     * Evaluate the polynomial at point x
     * @param x
     * @returns result of the evaluation of the polynomial at point x
     */
    evaluate(x: number): number;
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
    static getRandomPoly(degree: number, coefficients?: Uint8Array): PolynomialGF256;
}
