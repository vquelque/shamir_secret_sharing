export function isHex(hex: string): boolean {
  return !!hex.match(/^[0-9a-fA-F]+$/);
}

/**
 * Given a hex string, return a vector of numbers, where
 * each number belongs to GF(256)
 */
export function hexStringToUint8Array(hex: string): number[] {
  if (!isHex(hex)) {
    throw new Error(`Expected a hex string, but got ${hex}`);
  }
  
  if (hex.length % 2 != 0) {
    throw "Invalid hex string"
  }

  // Split the string into an array of strings with two hex characters each.
  const splitSecret = hex.match(/.{1,2}/g) as string[];

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