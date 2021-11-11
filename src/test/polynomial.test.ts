
import {PolynomialGF256} from "../math/polynomial"

const poly1 = new PolynomialGF256(new Uint8Array([1,0,0,1,1]))
const poly2 = new PolynomialGF256(new Uint8Array([1,0,1,0,1,1,1]))

beforeAll(() => {

})

test("mul 1 ", () => {
    const mulres = new Uint8Array([1,0,1,1,0,0,0,1,0,0,1])
    expect(poly1.mul(poly2)).toEqual(mulres)
})

test("evaluate constant poly", () => {
    const p = new PolynomialGF256(new Uint8Array([1]))
    expect(p.evaluate(10)).toBe(1)
})


test("evaluate poly", () => {
    const p = new PolynomialGF256(new Uint8Array([10,1]))
    expect(p.evaluate(10)).toBe(101)
})