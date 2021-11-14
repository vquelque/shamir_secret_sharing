
import {PolynomialGF256} from "../math/polynomial"

const poly1 = new PolynomialGF256(new Uint8Array([1,0,0,1,1]))
const poly2 = new PolynomialGF256(new Uint8Array([1,0,1,0,1,1,1]))

beforeAll(() => {

})


test("evaluate constant poly", () => {
    const p = new PolynomialGF256(new Uint8Array([1]))
    expect(p.evaluate(10)).toBe(1)
})


test("evaluate poly", () => {
    const p = new PolynomialGF256(new Uint8Array([10,1]))
    expect(p.evaluate(10)).toBe(69)
})

test("get random poly", () => {
    const poly = PolynomialGF256.getRandomPoly(5)
    expect(poly.coefficients.length).toBe(6)
})

test("get poly from coefficients array", () => {
    const poly = PolynomialGF256.getRandomPoly(2,new Uint8Array([3,2,1]))
    expect(poly.degree == 2)
    expect(poly.coefficients.length).toBe(3)
})

test("2 random polynomial coefficients should not be the same", () => {
    const poly1 = PolynomialGF256.getRandomPoly(10)
    const poly2 = PolynomialGF256.getRandomPoly(10)
    expect(poly1.coefficients).not.toContainEqual(poly2.coefficients)
})