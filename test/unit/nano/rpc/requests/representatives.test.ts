import { RepresentativesRequest } from "../../../../../src/nano/rpc/requests/representatives";

describe("RepresentativesRequest schema", () => {
  test("validates representatives request with optional sorting", () => {
    const result = RepresentativesRequest().safeParse({
      action: "representatives",
      count: 5,
      sorting: true,
    });
    expect(result.success).toBe(true);
  });

  test("rejects representatives request with invalid action", () => {
    const result = RepresentativesRequest().safeParse({
      action: "representatives_invalid",
    });
    expect(result.success).toBe(false);
  });

  test("rejects representatives request with invalid count", () => {
    const result = RepresentativesRequest().safeParse({
      action: "representatives_invalid",
      count: -1,
    });
    expect(result.success).toBe(false);
  });
});
