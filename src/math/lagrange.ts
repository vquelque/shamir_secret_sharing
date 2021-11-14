  import {mul,div,add,sub} from "./gf256"
  
  /**
   * Evaluate the Lagrange interpolation polynomial interpolated
   * from points of coordinates x,y * at point x = `at`
   * @param at Evaluate Lagrange polynomial `at`
   * @param x Array of integers representing x coordinates of interpolation points
   * @param y Array of integers representing y coordinates of interpolation points
   */
   export function lagrange(at: number, x: number[], y: number[]) {
    let sum = 0;
    for (let i = 0; i < x.length; i++) {
      let li = 1;
      for (let j = 0; j < x.length; j++) {
        if (i != j) {
          li = mul(li, div(sub(at, x[j]), sub(x[i], x[j])));
        }
      }
      sum = add(sum, mul(li, y[i]));
    }
    return sum;
  }