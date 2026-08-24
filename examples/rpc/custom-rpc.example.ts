import { Nano } from "nano-sdk";
import { z } from "zod";

type WorkGenerateRequest = z.infer<ReturnType<typeof WorkGenerateRequest>>;
const WorkGenerateRequest = () =>
  z.object({
    action: z.literal("work_generate"),
    hash: Nano.Types.HashString(),
    key: z.string(),
  });

type WorkGenerateResponse = z.infer<ReturnType<typeof WorkGenerateResponse>>;
const WorkGenerateResponse = () =>
  z.object({
    difficulty: Nano.Types.WorkDifficultyString(),
    multiplier: Nano.Types.NumberString(),
    work: Nano.Types.WorkString(),
    frontier: Nano.Types.HashString(),
    duration: z.string(),
    credits: z.number(),
    cached: z.boolean(),
  });

const NanoTo = {
  RPC: {
    WorkGenerateRequest,
    WorkGenerateResponse,
    work_generate: Nano.RPC.postFunction(WorkGenerateRequest(), WorkGenerateResponse()),
  },
};

async function generateWork() {
  const response: WorkGenerateResponse = await NanoTo.RPC.work_generate(
    "https://rpc.nano.to",
    {
      action: "work_generate",
      hash: "991CF190094C00F0B68E2E5F75F6BEE95A2E0BD93CEAA4A6734DB9F19B728948",
      key: "RPC-API-KEY",
    },
    { throwOnError: true }
  );

  console.log("Nano.to work response:", response);
}

generateWork().catch((err) => console.error("Unexpected failure:", err));
