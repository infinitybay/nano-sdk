import { RepresentativesOnlineResponse } from "../../../../../src/nano/rpc/responses/representatives-online";
import { TestData } from "../../../test-data";

describe("RepresentativesOnlineResponse schema", () => {
  test("parses representatives online response with empty representatives map", () => {
    const schema = RepresentativesOnlineResponse({ weight: false });
    const result = schema.safeParse({
      representatives: "",
    });
    expect(result.success).toBe(true);
  });

  test("parses representatives online response with weights", () => {
    const schema = RepresentativesOnlineResponse({ weight: true });
    const result = schema.safeParse({
      representatives: {
        [TestData.Valid.Representative1()]: { weight: TestData.Valid.RawAmount1() },
        [TestData.Valid.Representative2()]: { weight: TestData.Valid.RawAmount2() },
      },
    });
    expect(result.success).toBe(true);
  });

  test("parses representatives online response without weights", () => {
    const schema = RepresentativesOnlineResponse({ weight: false });
    const result = schema.safeParse({
      representatives: [TestData.Valid.Representative1(), TestData.Valid.Representative2()],
    });
    expect(result.success).toBe(true);
  });
});
