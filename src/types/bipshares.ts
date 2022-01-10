// Contains an array of shares
export type BIPShares = Share[];

// Represents a share `y` evaluated at coordinate `x` 
export type Share = {
  x: string;
  y: string;
};

// Array of shares encoded as string
export type EncodedShares = string[];

// Underlying entropy of BIP-39 mnemonic
export type Entropy = string

export type ShareMnemonic = string