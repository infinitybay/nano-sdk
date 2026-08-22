import { z } from "zod";

import { BinaryBooleanString } from "../../types";
import { BooleanDistribution } from "../../types/boolean-distribution";
import { NumberString } from "../../types/number";
import { UppercaseKeys } from "../../types/uppercase-keys";
import { WorkDifficultyString } from "../../types/work-difficulty";

const WorkValidateBase = () => ({
  valid_all: BinaryBooleanString(),
  valid_receive: BinaryBooleanString(),
  difficulty: WorkDifficultyString(),
  multiplier: NumberString(),
});

const WorkValidateValid = () => ({
  valid: BinaryBooleanString(),
});

type WorkValidateResponseOptions = {
  difficulty: boolean;
};

type WorkValidateResponseZodType<T extends UppercaseKeys<WorkValidateResponseOptions>> = BooleanDistribution<
  T["DIFFICULTY"],
  z.ZodObject<ReturnType<typeof WorkValidateBase> & ReturnType<typeof WorkValidateValid>>,
  z.ZodObject<ReturnType<typeof WorkValidateBase>>
>;

export type WorkValidateResponse<T extends UppercaseKeys<WorkValidateResponseOptions>> = z.infer<
  WorkValidateResponseZodType<T>
>;

export function WorkValidateResponse<T extends WorkValidateResponseOptions>(
  options: T
): WorkValidateResponseZodType<UppercaseKeys<T>>;
export function WorkValidateResponse(options: WorkValidateResponseOptions) {
  return z.object({
    ...WorkValidateBase(),
    ...(options.difficulty ? WorkValidateValid() : {}),
  });
}
