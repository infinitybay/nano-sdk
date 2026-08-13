import { ConfirmationQuorumResponse } from "../../../../../src/nano/rpc/responses/confirmation-quorum";
import { assert } from "../../../../assert";
import { TestData } from "../../../test-data";

describe("ConfirmationQuorumResponse schema", () => {
  test("parses confirmation quorum response without peer details", () => {
    const schema = ConfirmationQuorumResponse({ peer_details: false });
    const result = schema.safeParse({
      quorum_delta: TestData.Valid.RawAmount1(),
      online_weight_quorum_percent: "67",
      online_weight_minimum: TestData.Valid.RawAmount2(),
      online_stake_total: TestData.Valid.RawAmount3(),
      trended_stake_total: TestData.Valid.RawAmount4(),
      peers_stake_total: TestData.Valid.RawAmount1(),
    });
    assert(result.success);
  });

  test("parses confirmation quorum response with peer details", () => {
    const schema = ConfirmationQuorumResponse({ peer_details: true });
    const result = schema.safeParse({
      quorum_delta: TestData.Valid.RawAmount1(),
      online_weight_quorum_percent: "67",
      online_weight_minimum: TestData.Valid.RawAmount2(),
      online_stake_total: TestData.Valid.RawAmount3(),
      trended_stake_total: TestData.Valid.RawAmount4(),
      peers_stake_total: TestData.Valid.RawAmount1(),
      peers: [{ account: TestData.Valid.Account1(), ip: "127.0.0.1", weight: TestData.Valid.RawAmount2() }],
    });
    assert(result.success);
  });

  test("rejects confirmation quorum response with invalid peer account", () => {
    const schema = ConfirmationQuorumResponse({ peer_details: true });
    const result = schema.safeParse({
      quorum_delta: TestData.Valid.RawAmount1(),
      online_weight_quorum_percent: "67",
      online_weight_minimum: TestData.Valid.RawAmount2(),
      online_stake_total: TestData.Valid.RawAmount3(),
      trended_stake_total: TestData.Valid.RawAmount4(),
      peers_stake_total: TestData.Valid.RawAmount1(),
      peers: [
        { account: TestData.Invalid.Account.InvalidCharacters(), ip: "127.0.0.1", weight: TestData.Valid.RawAmount2() },
      ],
    });
    assert(!result.success);
  });
});
