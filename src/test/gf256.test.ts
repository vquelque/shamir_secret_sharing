import {add,mul,div} from  "../math/gf256"

test('adds 1 + 1 to equal 0', () => {
  expect(add(1, 1)).toBe(0);
});

test('adds 1 + 1 to equal 0', () => {
  expect(add(1, 1)).toBe(0);
});

test('adds 1 + 1 to equal 0', () => {
  expect(add(255, 2)).toBe(253);
});


test('mul 0 and 255 to equal 0', () => {
  expect(mul(255, 0)).toBe(0);
});

test('mul 0 and 255 to equal 0', () => {
  expect(mul(255, 0)).toBe(0);
});

test('mul 128 and 2 to equal 29', () => {
  expect(mul(128, 2)).toBe(29);
});
