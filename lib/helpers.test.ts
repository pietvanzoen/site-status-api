import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
import { flow } from "./helpers.ts";

const plusOne = (n: number) => n + 1;
const timesTwo = (n: number) => n * 2;

Deno.test("flow", () => {
  const actual = flow([plusOne, timesTwo])(2);
  const expected = (2 + 1) * 2;
  assertEquals(actual, expected);
});
