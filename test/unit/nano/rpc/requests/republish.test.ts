import { RepublishRequest } from "../../../../../src/nano/rpc/requests/republish";
import { assert } from "../../../../assert";
import { TestData } from "../../../test-data";

describe("RepublishRequest schema", () => {
  test("validates republish request with optional limits", () => {
    const result = RepublishRequest().safeParse({
      action: "republish",
      hash: TestData.Valid.Hash1(),
      count: 1,
      sources: 1,
      destinations: 1,
    });
    assert(result.success);
  });

  test("rejects republish request with invalid hash", () => {
    const result = RepublishRequest().safeParse({
      action: "republish",
      hash: TestData.Invalid.Hash.InvalidCharacters(),
    });
    assert(!result.success);
  });

  test("rejects republish request with invalid count", () => {
    const result = RepublishRequest().safeParse({
      action: "republish",
      hash: TestData.Valid.Hash1(),
      count: -1,
    });
    assert(!result.success);
  });
});
