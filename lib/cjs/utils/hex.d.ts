/**
 * Given a string, returns whether this string represents a hex number
 */
export declare function isHex(hex: string): boolean;
/**
 * Given a hex string, return a vector of numbers, where
 * each number belongs to GF(256)
 */
export declare function hexStringToUint8Array(hex: string): number[];
/**
 * Pads a string with the given padString on the left until the specified length is achieved
 * @param str The string to pad
 * @param padString The string to add
 * @param length The desired length of the result
 */
export declare function leftPad(str: string, padString: string, length: number): string;
