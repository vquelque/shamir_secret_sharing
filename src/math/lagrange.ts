  import {mul,div,add,sub} from "./gf256"
  
  /**
   * Evaluate the Lagrange interpolation polynomial at x = `at`
   */
   export function lagrange(at: number, x: number[], y: number[]) {
    let sum = 0;
    for (let i = 0; i < x.length; i++) {
      const aY = y[i];
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