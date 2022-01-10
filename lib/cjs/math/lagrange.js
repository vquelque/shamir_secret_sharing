"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lagrange = void 0;
const gf256_1 = require("./gf256");
/**
 * Evaluate the Lagrange interpolation polynomial interpolated
 * from points of coordinates x,y * at point x = `at`
 * @param at Evaluate Lagrange polynomial `at`
 * @param x Array of integers representing x coordinates of interpolation points
 * @param y Array of integers representing y coordinates of interpolation points
 */
function lagrange(at, x, y) {
    let sum = 0;
    for (let i = 0; i < x.length; i++) {
        let li = 1;
        for (let j = 0; j < x.length; j++) {
            if (i != j) {
                li = (0, gf256_1.mul)(li, (0, gf256_1.div)((0, gf256_1.sub)(at, x[j]), (0, gf256_1.sub)(x[i], x[j])));
            }
        }
        sum = (0, gf256_1.add)(sum, (0, gf256_1.mul)(li, y[i]));
    }
    return sum;
}
exports.lagrange = lagrange;
