import { Nano } from "nano-sdk";

// These keys are public example data. Never use them for real funds.
const sourcePrivateKey: Nano.Types.PrivateKeyString =
  "B7DDAF5DDE0169C84A904909CC6C206B4EE32493E7B549A95900B5D2E5C78BFA";
const destinationPrivateKey: Nano.Types.PrivateKeyString =
  "EB520D0273B8BC6520C195814DD81971AEC82A8BA882EA5324547FFF63B1C5CF";
const destination: Nano.Types.AccountString = Nano.Crypto.deriveAccountFromPrivateKey({ privateKey: destinationPrivateKey });

// The latest state block of the sending account, for example obtained through block_info.
const sourceFrontierBlock: Nano.Blocks.StateBlock = {
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
  const firstSendBlock = Nano.Blocks.createSendBlock({
    amount: "1000",
    destination,
    frontierBlock: sourceFrontierBlock,
    privateKey: sourcePrivateKey,
  });

  const secondSendBlock = Nano.Blocks.createSendBlock({
    amount: "500",
    destination,
    frontierBlock: firstSendBlock,
    privateKey: sourcePrivateKey,
  });

  // Opening an account requires the send block that funded it and an explicit representative.
  const openBlock = Nano.Blocks.createOpenBlock({
    amount: "1000",
    representative: destination,
    sendBlock: firstSendBlock,
    privateKey: destinationPrivateKey,
  });

  const changeBlock = Nano.Blocks.createChangeBlock({
    frontierBlock: openBlock,
    representative: "nano_3riqbe6ze7h94zudnbbwtzoj14f5yuykys6gsz3bk6z6n5sh8tag1zniozqt",
    privateKey: destinationPrivateKey,
  });

  // Receiving requires the destination account's frontier and the complete source send block.
  const receiveBlock = Nano.Blocks.createReceiveBlock({
    amount: "500",
    frontierBlock: changeBlock,
    sendBlock: secondSendBlock,
    privateKey: destinationPrivateKey,
  });

  console.log({ firstSendBlock, openBlock, changeBlock, secondSendBlock, receiveBlock });
} catch (err) {
  console.error("Unexpected failure:", err);
}
