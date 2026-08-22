import { SignRequest } from "../../../../../src/nano/rpc/requests/sign";
import { assert } from "../../../../assert";
import { TestData } from "../../../test-data";

describe("SignRequest schema", () => {
  const credentials = [
    ["private key", { key: TestData.Valid.PrivateKey1() }],
    ["wallet and account", { wallet: TestData.Valid.PublicKey1(), account: TestData.Valid.Account1() }],
  ] as const;

  const inputs = [
    ["JSON state block", { json_block: true, block: TestData.Valid.StateBlock1() }],
    ["state block string", { json_block: false, block: JSON.stringify(TestData.Valid.StateBlock1()) }],
    ["state block string with default JSON mode", { block: JSON.stringify(TestData.Valid.StateBlock1()) }],
    ["hash in JSON mode", { json_block: true, hash: TestData.Valid.Hash1() }],
    ["hash in string mode", { json_block: false, hash: TestData.Valid.Hash1() }],
    ["hash with default JSON mode", { hash: TestData.Valid.Hash1() }],
  ] as const;

  describe.each(credentials)("with %s credentials", (_description, credential) => {
    test.each(inputs)("validates a request with %s", (_inputDescription, input) => {
      const result = SignRequest().safeParse({ action: "sign", ...credential, ...input });
      assert(result.success);
    });
  });

  test.each([
    ["without a signing source", { action: "sign", json_block: true, block: TestData.Valid.StateBlock1() }],
    [
      "with a wallet but no account",
      {
        action: "sign",
        wallet: TestData.Valid.PublicKey1(),
        json_block: true,
        block: TestData.Valid.StateBlock1(),
      },
    ],
    [
      "with an account but no wallet",
      {
        action: "sign",
        account: TestData.Valid.Account1(),
        json_block: true,
        block: TestData.Valid.StateBlock1(),
      },
    ],
    [
      "with both credential sources",
      {
        action: "sign",
        key: TestData.Valid.PrivateKey1(),
        wallet: TestData.Valid.PublicKey1(),
        account: TestData.Valid.Account1(),
        json_block: true,
        block: TestData.Valid.StateBlock1(),
      },
    ],
    [
      "with a private key and wallet",
      {
        action: "sign",
        key: TestData.Valid.PrivateKey1(),
        wallet: TestData.Valid.PublicKey1(),
        json_block: true,
        block: TestData.Valid.StateBlock1(),
      },
    ],
    [
      "with a private key and account",
      {
        action: "sign",
        key: TestData.Valid.PrivateKey1(),
        account: TestData.Valid.Account1(),
        json_block: true,
        block: TestData.Valid.StateBlock1(),
      },
    ],
    ["without a block or hash", { action: "sign", key: TestData.Valid.PrivateKey1(), json_block: true }],
    [
      "with both a block and hash",
      {
        action: "sign",
        key: TestData.Valid.PrivateKey1(),
        json_block: true,
        block: TestData.Valid.StateBlock1(),
        hash: TestData.Valid.Hash1(),
      },
    ],
    [
      "with a block string in JSON mode",
      {
        action: "sign",
        key: TestData.Valid.PrivateKey1(),
        json_block: true,
        block: JSON.stringify(TestData.Valid.StateBlock1()),
      },
    ],
    [
      "with a block object in string mode",
      {
        action: "sign",
        key: TestData.Valid.PrivateKey1(),
        json_block: false,
        block: TestData.Valid.StateBlock1(),
      },
    ],
    [
      "with a block object in default string mode",
      { action: "sign", key: TestData.Valid.PrivateKey1(), block: TestData.Valid.StateBlock1() },
    ],
    [
      "with an invalid block string",
      { action: "sign", key: TestData.Valid.PrivateKey1(), json_block: false, block: "block-string" },
    ],
    [
      "with a legacy block string",
      {
        action: "sign",
        key: TestData.Valid.PrivateKey1(),
        json_block: false,
        block: JSON.stringify(TestData.Valid.LegacySendBlock()),
      },
    ],
    [
      "with a legacy JSON block",
      {
        action: "sign",
        key: TestData.Valid.PrivateKey1(),
        json_block: true,
        block: TestData.Valid.LegacySendBlock(),
      },
    ],
    [
      "with an invalid hash",
      {
        action: "sign",
        key: TestData.Valid.PrivateKey1(),
        hash: TestData.Invalid.Hash.InvalidCharacters(),
      },
    ],
  ])("rejects a request %s", (_description, request) => {
    const result = SignRequest().safeParse(request);
    assert(!result.success);
  });
});
