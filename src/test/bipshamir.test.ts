import {BIPShamir} from "../bipshamir"
import {mnemonicToEntropy, entropyToMnemonic} from "bip39"
import { BIPShares } from "../types/bipshares"

test.only("test recover secret with all shares", () => {
    const ss = new BIPShamir(5,3)
    const mnemonic = "marble digital nominee flower lady burst wrestle trend silk wave unaware palm monster shoot odor" 
    const shares = ss.createShares(mnemonic)
    const recover = BIPShamir.recoverSecret(shares)
    expect(recover).toEqual(mnemonic)
    expect(shares.length).toBe(5)
    shares.reduce((acc,s) => {
        expect(acc).not.toContain(s)
        acc.push(s)
        return acc
    },[])
})

test.only("test recover secret with all shares", () => {
    const ss = new BIPShamir(5,3)
    const mnemonic = "marble digital nominee flower lady burst wrestle trend silk wave unaware palm monster shoot odor" 
    const shares = ss.createShares(mnemonic)
    const shares_2 = shares.slice(3,5)
    const shares_3 = [shares[0], ...shares_2]
    const recover = BIPShamir.recoverSecret(shares)
    expect(recover).toEqual(mnemonic)
})

test("test create version string",() => {
    const ss = new BIPShamir(3,2)
    const mnemonic = "marble digital nominee flower lady burst wrestle trend silk wave unaware palm monster shoot odor" 
    const shares = ss.createShares(mnemonic)
    console.log(shares)
})
