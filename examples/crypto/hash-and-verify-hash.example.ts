import { Nano } from "nano-sdk";

type StateBlock = Nano.Blocks.StateBlock;
const StateBlock = Nano.Blocks.StateBlock();

const stateBlock: StateBlock = {
  type: "state",
  account: "nano_3gzkxkbc6jpinataxe19jt57thasr8waatbxdhzpe4utcfo19ojbdnocoyee",
  previous: "0000000000000000000000000000000000000000000000000000000000000000",
  representative: "nano_3jgm64cjcyo4z5qffeneyfkinypaimdebro697t6fc5prc6jtoy8797yyci7",
  balance: "1000000000000000000000000000000001",
  link: "994FB51A40E516B8BC82299CDC71575A2F8E5ACFAB090EC963EAFE596A940E32",
  link_as_account: "nano_38chpnf63sapq4ya6cewujrogpjhjsfezcrb3u6p9tqyd7oba5jkx5irysno",
  signature:
    "6B6F2E7084758376BDDAC947E31DCFEDC055F1DA98C5DC0169AF4D5A53376BE1791C3D0C6989D19172BDFBB4DDA840C5422A49E73F8EB5E62315576E4FAD150B",
  work: "7b7ca1f0bf86cee4",
};

try {
  const hash = Nano.Crypto.hashBlock(stateBlock);
  const validHash = Nano.Crypto.verifyHash({ hash: hash, block: stateBlock });
  console.log("Valid Hash:", validHash); // prints "Valid Hash: true"
} catch (err) {
  console.error("Unexpected failure:", err);
}
