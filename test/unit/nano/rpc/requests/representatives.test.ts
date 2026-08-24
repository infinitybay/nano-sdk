import { RepresentativesRequest } from "../../../../../src/nano/rpc/requests/representatives";
import { assert } from "../../../../assert";
import { TestData } from "../../../test-data";

describe("RepresentativesRequest schema", () => {
  test("validates representatives request with optional threshold and sorting", () => {
    const result = RepresentativesRequest().safeParse({
      action: "representatives",
      count: 5,
      sorting: true,
      threshold: TestData.Valid.RawAmount1(),
    });
    assert(result.success);
    expect(result.data.threshold).toBe(TestData.Valid.RawAmount1());
  });

  test("rejects representatives request with invalid action", () => {
    const result = RepresentativesRequest().safeParse({
      action: "representatives_invalid",
    });
    assert(!result.success);
  });

  test("rejects representatives request with invalid count", () => {
    const result = RepresentativesRequest().safeParse({
      action: "representatives",
      count: -1,
    });
    assert(!result.success);
  });

  test("rejects representatives request with invalid threshold", () => {
    const result = RepresentativesRequest().safeParse({
      action: "representatives",
      threshold: TestData.Invalid.RawAmount.InvalidCharacters(),
    });
    assert(!result.success);
  });
});
