import { RepresentativesRequest } from "../../../../../src/nano/rpc/requests/representatives";
import { assert } from "../../../../assert";

describe("RepresentativesRequest schema", () => {
  test("validates representatives request with optional sorting", () => {
    const result = RepresentativesRequest().safeParse({
      action: "representatives",
      count: 5,
      sorting: true,
    });
    assert(result.success);
  });

  test("rejects representatives request with invalid action", () => {
    const result = RepresentativesRequest().safeParse({
      action: "representatives_invalid",
    });
    assert(!result.success);
  });

  test("rejects representatives request with invalid count", () => {
    const result = RepresentativesRequest().safeParse({
      action: "representatives_invalid",
      count: -1,
    });
    assert(!result.success);
  });
});
