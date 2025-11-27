import { LegacyOpenBlock, StateBlock } from "../../src/nano/blocks";
import {
  AccountString,
  HashString,
  PrivateKeyString,
  PublicKeyString,
  SeedIndex,
  SeedString,
} from "../../src/nano/types";

export const TestData = {
  BurnAccount: (): AccountString => "nano_1111111111111111111111111111111111111111111111111111hifc8npp",
  BurnPublicKey: (): PublicKeyString => "0000000000000000000000000000000000000000000000000000000000000000",
  BurnBlockHash: (): HashString => "ECCB8CB65CD3106EDA8CE9AA893FEAD497A91BCA903890CBD7A5C59F06AB9113",

  GenesisAccount: (): AccountString => "nano_3t6k35gi95xu6tergt6p69ck76ogmitsa8mnijtpxm9fkcm736xtoncuohr3",
  GenesisPublicKey: (): PublicKeyString => "E89208DD038FBB269987689621D52292AE9C35941A7484756ECCED92A65093BA",
  GenesisBlock: (): LegacyOpenBlock => ({
    type: "open",
    source: "E89208DD038FBB269987689621D52292AE9C35941A7484756ECCED92A65093BA",
    representative: "nano_3t6k35gi95xu6tergt6p69ck76ogmitsa8mnijtpxm9fkcm736xtoncuohr3",
    account: "nano_3t6k35gi95xu6tergt6p69ck76ogmitsa8mnijtpxm9fkcm736xtoncuohr3",
    work: "62f05417dd3fb691",
    signature:
      "9F0C933C8ADE004D808EA1985FA746A7E95BA2A38F867640F53EC8F180BDFE9E2C1268DEAD7C2664F356E37ABA362BC58E46DBA03E523A7B5A19E4B6EB12BB02",
  }),
  GenesisBlockHash: (): HashString => "991CF190094C00F0B68E2E5F75F6BEE95A2E0BD93CEAA4A6734DB9F19B728948",

  KeySet: () => ({
    Seed: (): SeedString => "36845C54B9CC4095BBF1345D9D3E5CC0B373CC16C85B1022CDE111947DA6AF10",
    SeedIndex: (): SeedIndex => 0,
    PrivateKey: (): PrivateKeyString => "B7DDAF5DDE0169C84A904909CC6C206B4EE32493E7B549A95900B5D2E5C78BFA",
    PublicKey: (): PublicKeyString => "BBF2EC92A246D0A2348EB0078E865D3D19C1B884693D5BFF660B7A536A03D629",
    Account: (): AccountString => "nano_3gzkxkbc6jpinataxe19jt57thasr8waatbxdhzpe4utcfo19ojbdnocoyee",
  }),

  StateBlock: (): StateBlock => ({
    type: "state",
    account: "nano_3gzkxkbc6jpinataxe19jt57thasr8waatbxdhzpe4utcfo19ojbdnocoyee",
    previous: "0000000000000000000000000000000000000000000000000000000000000000",
    representative: "nano_3jgm64cjcyo4z5qffeneyfkinypaimdebro697t6fc5prc6jtoy8797yyci7",
    balance: "1000000000000000000000000000000001",
    link: "994FB51A40E516B8BC82299CDC71575A2F8E5ACFAB090EC963EAFE596A940E32",
    link_as_account: "nano_38chpnf63sapq4ya6cewujrogpjhjsfezcrb3u6p9tqyd7oba5jkx5irysno",
    signature:
      "6B6F2E7084758376BDDAC947E31DCFEDC055F1DA98C5DC0169AF4D5A53376BE1791C3D0C6989D19172BDFBB4DDA840C5422A49E73F8EB5E62315576E4FAD150B",
    work: "dc6bb78379e8e935",
  }),
  StateBlockHash: (): HashString => "523F8240320ACA742BEE4A1223FFE35E5B88BFAA2D179E89AD71A5C9A3AE456C",
  StateBlockString: (): string => JSON.stringify(TestData.StateBlock()),
};
