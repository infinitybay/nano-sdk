import { BootstrapMessage, BootstrapResponse } from "../../../../../src/nano/web-socket/responses/bootstrap";
import { TestData } from "../../../test-data";

describe("BootstrapMessage schema", () => {
  test("validates bootstrap started message", () => {
    const result = BootstrapMessage().safeParse({ reason: "started", id: "abc", mode: "legacy" });
    expect(result.success).toBe(true);
  });

  test("validates bootstrap exited message", () => {
    const result = BootstrapMessage().safeParse({
      reason: "exited",
      id: "abc",
      mode: "legacy",
      total_blocks: "10",
      duration: TestData.Valid.Timestamp1(),
    });
    expect(result.success).toBe(true);
  });

  test("rejects bootstrap message with invalid total blocks", () => {
    const result = BootstrapMessage().safeParse({
      reason: "exited",
      id: "abc",
      mode: "legacy",
      total_blocks: "-1",
      duration: TestData.Valid.Timestamp1(),
    });
    expect(result.success).toBe(false);
  });
});

describe("BootstrapResponse schema", () => {
  test("validates bootstrap response", () => {
    const result = BootstrapResponse().safeParse({
      topic: "bootstrap",
      time: TestData.Valid.Timestamp1(),
      message: { reason: "started", id: "id-1", mode: "bulk" },
    });
    expect(result.success).toBe(true);
  });

  test("rejects bootstrap response with invalid time", () => {
    const result = BootstrapResponse().safeParse({
      topic: "bootstrap",
      time: "-1",
      message: { reason: "started", id: "id-1", mode: "bulk" },
    });
    expect(result.success).toBe(false);
  });
});
