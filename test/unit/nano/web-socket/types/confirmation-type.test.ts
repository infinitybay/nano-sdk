import { ConfirmationType } from "../../../../../src/nano/web-socket/types/confirmation-type";
import { assert } from "../../../../assert";

describe("ConfirmationType schema", () => {
  test("validates allowed confirmation types", () => {
    expect(ConfirmationType().parse("active")).toBe("active");
    expect(ConfirmationType().parse("active_confirmation_height")).toBe("active_confirmation_height");
    expect(ConfirmationType().parse("active_quorum")).toBe("active_quorum");
    expect(ConfirmationType().parse("all")).toBe("all");
    expect(ConfirmationType().parse("inactive")).toBe("inactive");
  });

  test("rejects unsupported confirmation types", () => {
    assert(!ConfirmationType().safeParse("other").success);
  });
});
