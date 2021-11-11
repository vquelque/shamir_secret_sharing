import {BIPShamir} from "../bipshamir"
import {mnemonicToEntropy, entropyToMnemonic} from "bip39"

test("test split hex", () => {
    const ss = new BIPShamir(3,2)
    const mnemonic = "marble digital nominee flower lady burst wrestle trend silk wave unaware palm monster shoot odor" 
    const shares = ss.createShares(mnemonic)
    const recover = ss.recoverMnemonicFromShares(shares)
    expect(recover).toEqual(mnemonicToEntropy(mnemonic))
})
