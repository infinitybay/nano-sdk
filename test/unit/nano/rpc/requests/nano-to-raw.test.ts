import { NanoToRawRequest } from "../../../../../src/nano/rpc/requests/nano-to-raw";
import { TestData } from "../../../test-data";

describe("NanoToRawRequest schema", () => {
  test("validates nano to raw request", () => {
    const result = NanoToRawRequest().safeParse({
      action: "nano_to_raw",
      amount: TestData.Valid.NanoAmount1(),
    });
    expect(result.success).toBe(true);
  });

  test("rejects nano to raw request with invalid amount", () => {
    const result = NanoToRawRequest().safeParse({
      action: "nano_to_raw",
      amount: TestData.Invalid.NanoAmount.InvalidCharacters(),
    });
    expect(result.success).toBe(false);
  });
});
