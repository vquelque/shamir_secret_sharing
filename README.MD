# Shamir Secret Sharing in Typescript

This is a typescript implementation of Shamir Secret Sharing for BIP-39
mnemonics commonly used to save cryptocurrency wallets private keys.

## How to use

1. Install the library in your project using `yarn install bipshamir` or
   `npm install bipshamir`
2. Create a new BIPShamir object `b = new BIPShamir(M,N)` with your configuration:
   - `N`: Total number of shares to create
   - `M`: Number of shares (threshold) needed to recover the secret
3. Create the shares : `b.createShares(mnemonic)` where `mnemonic` is
   your BIP-39 seed phrase
4. You can recover the original BIP-39 seed by calling the static method
   `BIPShamir.recoverSecret(shares)` with `shares` an array containing at least
   `M` shares

## Principle

This library implements [Shamir's Secret Sharing ](https://en.wikipedia.org/wiki/Shamir%27s_Secret_Sharing) in
Galois Field GF256. We choose to use GF256 in order to leverage bitwise operations and imporve performances. All arithmetic is done in GF256.

This library generates new mnemonics from your original BIP-39 mnemonic. These newly generated mnemonics can be shared with different parties so that you can recover your original menmonic from the shares as long as you can access enough shares (more than the predefined threshold).

Shamir Secret Sharing is information theoratically secure. This means an adversary with unlimited computing power cannot infer anything from the original secret by observing any combination of `K` shares as long as `K < M`.
