import { BootstrapMessage, BootstrapResponse } from "../../../../../src/nano/web-socket/responses/bootstrap";
import { assert } from "../../../../assert";
import { TestData } from "../../../test-data";

describe("BootstrapMessage schema", () => {
  test("validates bootstrap started message", () => {
    const result = BootstrapMessage().safeParse({ reason: "started", id: "abc", mode: "legacy" });
    assert(result.success);
  });

  test("validates bootstrap exited message", () => {
    const result = BootstrapMessage().safeParse({
      reason: "exited",
      id: "abc",
      mode: "legacy",
      total_blocks: "10",
      duration: TestData.Valid.Timestamp1(),
    });
    assert(result.success);
  });

  test("rejects bootstrap message with invalid total blocks", () => {
    const result = BootstrapMessage().safeParse({
      reason: "exited",
      id: "abc",
      mode: "legacy",
      total_blocks: "-1",
      duration: TestData.Valid.Timestamp1(),
    });
    assert(!result.success);
  });
});

describe("BootstrapResponse schema", () => {
  test("validates bootstrap response", () => {
    const result = BootstrapResponse().safeParse({
      topic: "bootstrap",
      time: TestData.Valid.Timestamp1(),
      message: { reason: "started", id: "id-1", mode: "bulk" },
    });
    assert(result.success);
  });

  test("rejects bootstrap response with invalid time", () => {
    const result = BootstrapResponse().safeParse({
      topic: "bootstrap",
      time: "-1",
      message: { reason: "started", id: "id-1", mode: "bulk" },
    });
    assert(!result.success);
  });
});
