import { NanoPow } from "nano-pow"; // Install the optional local work generator with: npm i nano-pow
import { Nano } from "nano-sdk";

// These keys are public example data. Never use them for real funds.
const sourcePrivateKey: Nano.Types.PrivateKeyString = "B7DDAF5DDE0169C84A904909CC6C206B4EE32493E7B549A95900B5D2E5C78BFA";
const destinationPrivateKey: Nano.Types.PrivateKeyString = "EB520D0273B8BC6520C195814DD81971AEC82A8BA882EA5324547FFF63B1C5CF";
const destination: Nano.Types.AccountString = Nano.Crypto.deriveAccountFromPrivateKey({ privateKey: destinationPrivateKey });

const sendChangeDifficulty: Nano.Types.WorkDifficultyString = "FFFFFFF800000000";
const openReceiveDifficulty: Nano.Types.WorkDifficultyString = "FFFFFE0000000000";

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

async function generateWork(
  workRoot: Nano.Types.HashString | Nano.Types.PublicKeyString,
  difficulty: Nano.Types.WorkDifficultyString
) {
  const { work } = await NanoPow.work_generate(workRoot, { difficulty });
  const validatedWork = Nano.Types.WorkString().parse(work);

  if (!Nano.Crypto.verifyWork({ hash: workRoot, work: validatedWork, threshold: difficulty })) {
    throw new Error("NanoPow returned invalid work.");
  }

  return validatedWork;
}

async function send(params: Nano.Blocks.CreateSendBlockParams): Promise<Nano.Blocks.StateBlock> {
  const block = Nano.Blocks.createSendBlock(params);
  const workRoot = Nano.Crypto.hashBlock({ block: params.frontierBlock });
  block.work = await generateWork(workRoot, sendChangeDifficulty);
  return block;
}

async function open(params: Nano.Blocks.CreateOpenBlockParams): Promise<Nano.Blocks.StateBlock> {
  const block = Nano.Blocks.createOpenBlock(params);
  // An open block has no frontier, so its account public key is the work root.
  const workRoot = Nano.Crypto.derivePublicKeyFromAccount({ account: block.account });
  block.work = await generateWork(workRoot, openReceiveDifficulty);
  return block;
}

async function change(params: Nano.Blocks.CreateChangeBlockParams): Promise<Nano.Blocks.StateBlock> {
  const block = Nano.Blocks.createChangeBlock(params);
  const workRoot = Nano.Crypto.hashBlock({ block: params.frontierBlock });
  block.work = await generateWork(workRoot, sendChangeDifficulty);
  return block;
}

async function receive(params: Nano.Blocks.CreateReceiveBlockParams): Promise<Nano.Blocks.StateBlock> {
  const block = Nano.Blocks.createReceiveBlock(params);
  const workRoot = Nano.Crypto.hashBlock({ block: params.frontierBlock });
  block.work = await generateWork(workRoot, openReceiveDifficulty);
  return block;
}

async function createPublishableStateBlocks() {
  try {
    const firstSendBlock = await send({
      amount: "1000",
      destination,
      frontierBlock: sourceFrontierBlock,
      privateKey: sourcePrivateKey,
    });

    const secondSendBlock = await send({
      amount: "500",
      destination,
      frontierBlock: firstSendBlock,
      privateKey: sourcePrivateKey,
    });

    const openBlock = await open({
      amount: "1000",
      representative: destination,
      sendBlock: firstSendBlock,
      privateKey: destinationPrivateKey,
    });

    const changeBlock = await change({
      frontierBlock: openBlock,
      representative: "nano_3riqbe6ze7h94zudnbbwtzoj14f5yuykys6gsz3bk6z6n5sh8tag1zniozqt",
      privateKey: destinationPrivateKey,
    });

    const receiveBlock = await receive({
      amount: "500",
      frontierBlock: changeBlock,
      sendBlock: secondSendBlock,
      privateKey: destinationPrivateKey,
    });

    console.log({ firstSendBlock, openBlock, changeBlock, secondSendBlock, receiveBlock });
  } catch (err) {
    console.error("Unexpected failure:", err);
  }
}

createPublishableStateBlocks();
