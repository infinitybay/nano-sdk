import { NanoToRawRequest } from "../../../../../src/nano/rpc/requests/nano-to-raw";
import { assert } from "../../../../assert";
import { TestData } from "../../../test-data";

describe("NanoToRawRequest schema", () => {
  test.each(["1", "340282366"])("validates positive integer amount string %s", (amount) => {
    const result = NanoToRawRequest().safeParse({
      action: "nano_to_raw",
      amount,
    });
    assert(result.success);
  });

  test.each([1, 340282366])("validates positive integer amount %s", (amount) => {
    const result = NanoToRawRequest().safeParse({
      action: "nano_to_raw",
      amount,
    });
    assert(result.success);
  });

  test.each([
    "0",
    "01",
    "1000.000000000000000000000000000001",
    "340282367",
    TestData.Invalid.NanoAmount.InvalidCharacters(),
    TestData.Invalid.NanoAmount.Negative(),
  ])("rejects invalid amount string %s", (amount) => {
    const result = NanoToRawRequest().safeParse({ action: "nano_to_raw", amount });
    assert(!result.success);
  });

  test.each([0, -1, 1.5, 340282367, Number.NaN, Number.POSITIVE_INFINITY])(
    "rejects invalid numeric amount %s",
    (amount) => {
      const result = NanoToRawRequest().safeParse({ action: "nano_to_raw", amount });
      assert(!result.success);
    }
  );
});
