import {BIPShamir} from "../bipshamir"

const mnemonic = "marble digital nominee flower lady burst wrestle trend silk wave unaware palm monster shoot odor" 

test("test recover secret with all shares", () => {
    const ss = new BIPShamir(5,3)
    const shares = ss.createShares(mnemonic)
    const recover = BIPShamir.recoverSecret(shares)
    expect(recover).toEqual(mnemonic)
    expect(shares.length).toBe(5)
    shares.reduce<Array<string>>((acc,s) => {
        expect(acc).not.toContain(s)
        acc.push(s)
        return acc
    },[])
})

test("test recover secret with all shares 2", () => {
    const ss = new BIPShamir(5,3)
    const shares = ss.createShares(mnemonic)
    const shares_2 = shares.slice(3,5)
    const shares_3 = [shares[0], ...shares_2]
    const recover = BIPShamir.recoverSecret(shares)
    expect(recover).toEqual(mnemonic)
})

test("recovever secret without enough share should throw an error",() => {
    const ss = new BIPShamir(4,3)
    const shares = ss.createShares(mnemonic)
    const shares_2 = [shares[0],shares[3]]
    expect(() => BIPShamir.recoverSecret(shares_2)).toThrow(Error)
})

test("recover secret with serveral times the same share should throw an error", () => {
    const ss = new BIPShamir(5,3)
    const shares = ss.createShares(mnemonic)
    const shares_same = [shares[0] ,shares[0], shares[0] ]
    expect(() => BIPShamir.recoverSecret(shares_same)).toThrow(Error)
})
