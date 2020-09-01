import { useMemo } from "preact/hooks";
import { createTestProxy } from "../createTestProxy";

const [prxMemo] = createTestProxy(useMemo, { shallow: true });

it("will return a result", () => {
  const value = {};

  const returnedValue = prxMemo(() => value, []);
  expect(returnedValue).toBe(value);
});
