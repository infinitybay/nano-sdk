import { UpdateAckResponse } from "../../../../../src/nano/web-socket/responses/update-ack-response";
import { TestData } from "../../../test-data";

describe("UpdateAckResponse schema", () => {
  test("validates update ack response", () => {
    const result = UpdateAckResponse().safeParse({ ack: "update", time: TestData.Valid.Timestamp1(), id: "42" });
    expect(result.success).toBe(true);
  });

  test("rejects update ack response with invalid time", () => {
    const result = UpdateAckResponse().safeParse({ ack: "update", time: "-1" });
    expect(result.success).toBe(false);
  });
});
