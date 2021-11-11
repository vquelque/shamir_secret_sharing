export function isHex(hex: string): boolean {
  return !!hex.match(/^[0-9a-fA-F]+$/);
}

/**
 * Given a hex string, return a vector of numbers, where
 * each number belongs to GF(256)
 */
export function hexToIntVector(hex: string): number[] {
  /* istanbul ignore if */
  if (!isHex(hex)) {
    throw new Error(`Expected a hex string, but got ${hex}`);
  }

  /**
   * Any two digit hex number belongs to GF(256), so we will split the given
   * hex string into an array of two digit hex strings and then convert to
   * numbers.
   */

  // If we have an odd number of digits, padd a 0 to the front to preserve the
  // full number.
  // Note, this will never occur with a valid BIP39 entropy
  const paddedSecret = leftPad(hex, '0', hex.length + (hex.length % 2));
 
  // Split the string into an array of strings with two hex characters each.
  const splitSecret = paddedSecret.match(/.{1,2}/g) as string[];

  // Convert the hex strings to an Uin8Array of integers.
  var Uint8Array = new Array();
  splitSecret.forEach(value => Uint8Array.push(parseInt(value, 16)))
  return Uint8Array
}

/**
 * Pads a string with the given padString on the left until the specified length is achieved
 * @param str The string to pad
 * @param padString The string to add
 * @param length The desired length of the result
 */
 export function leftPad(
    str: string,
    padString: string,
    length: number
  ): string {
    while (str.length < length) {
      str = padString + str;
    }
    return str;
  }