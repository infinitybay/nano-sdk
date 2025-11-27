import { z } from "zod";

import { AccountPrefix, AccountString, AccountStringSuperRefine } from "../../../../src/nano/types/account";
import { TestData } from "../../test-data";

describe("AccountString schema", () => {
  test("validates parsing of valid accounts", () => {
    const validAccounts = [
      TestData.Valid.Account1(),
      TestData.Valid.Account2(),
      TestData.Valid.Account3(),
      TestData.Valid.Account4(),
    ];
    for (const validAccount of validAccounts) {
      expect(AccountString().parse(validAccount)).toBe(validAccount);
    }
  });

  test("rejects accounts with checksum mismatch", () => {
    const result = AccountString().safeParse(TestData.Invalid.Account.ChecksumMismatch());
    expect(result.success).toBe(false);
  });

  test("rejects accounts with invalid characters", () => {
    const result = AccountString().safeParse(TestData.Invalid.Account.InvalidCharacters());
    expect(result.success).toBe(false);
  });

  test("rejects accounts missing nano prefix", () => {
    const result = AccountString().safeParse(TestData.Invalid.Account.PrefixMissing());
    expect(result.success).toBe(false);
  });

  test("rejects accounts with incorrect prefix", () => {
    const result = AccountString().safeParse(TestData.Invalid.Account.PrefixWrong());
    expect(result.success).toBe(false);
  });

  test("rejects accounts exceeding length limit", () => {
    const result = AccountString().safeParse(TestData.Invalid.Account.TooLong());
    expect(result.success).toBe(false);
  });

  test("rejects accounts below length requirement", () => {
    const result = AccountString().safeParse(TestData.Invalid.Account.TooShort());
    expect(result.success).toBe(false);
  });

  test("custom account prefix", () => {
    expect(
      AccountString({ prefix: "custom_" }).safeParse(
        "custom_1ouymff97wjza6qzswy1jmxkc1fw5pi3nugr9tz9sa1kmpssd7kmioqkbu4m"
      ).success
    ).toBe(true);
  });
});

describe("AccountPrefix schema", () => {
  test("default account prefix", () => {
    expect(AccountPrefix().parse("nano_")).toBe("nano_");
    expect(AccountPrefix().safeParse("xrb_").success).toBe(false);
  });

  test("custom account prefix", () => {
    expect(AccountPrefix({ prefix: "custom_" }).safeParse("custom_").success).toBe(true);
  });
});

describe("AccountStringSuperRefine validator", () => {
  test("records validation issue for checksum mismatch", () => {
    const ctx = { addIssue: jest.fn() } as unknown as z.RefinementCtx;
    AccountStringSuperRefine(TestData.Invalid.Account.ChecksumMismatch(), ctx, "nano_");
    expect(ctx.addIssue).toHaveBeenCalled();
  });
});
