import { RawAmountString } from "../types/amount";
import { NonThrowing } from "../types/non-throwing";
import { Result } from "../types/result";
import { Throwing } from "../types/throwing";

type RawDivideParams = {
  dividend: RawAmountString;
  divisor: RawAmountString;
} & (Throwing | NonThrowing);

function rawDivideThrowing(params: RawDivideParams & Throwing): RawAmountString {
  const dividendResult = RawAmountString().safeParse(params.dividend);
  if (!dividendResult.success) {
    throw new Error("Invalid dividend value.");
  }

  const divisorResult = RawAmountString().safeParse(params.divisor);
  if (!divisorResult.success) {
    throw new Error("Invalid divisor value.");
  }

  const dividend = BigInt(dividendResult.data);
  const divisor = BigInt(divisorResult.data);

  if (divisor === 0n) {
    throw new Error("Division by zero is not allowed.");
  }

  const quotient = dividend / divisor;
  const remainder = dividend % divisor;

  if (remainder !== 0n) {
    throw new Error("Resulting amount must be an integer.");
  }

  const result = RawAmountString().safeParse(quotient.toString());
  if (!result.success) {
    throw new Error("Resulting amount is no valid raw amount.");
  }

  return result.data;
}

function rawDivideNonThrowing(params: RawDivideParams & NonThrowing): Result<RawAmountString> {
  try {
    return {
      success: true,
      data: rawDivideThrowing({ ...params, throwOnError: true }),
    };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e : new Error("Unexpected error."),
    };
  }
}

export function rawDivide(params: RawDivideParams & NonThrowing): Result<RawAmountString>;
export function rawDivide(params: RawDivideParams & Throwing): RawAmountString;
export function rawDivide(params: RawDivideParams): RawAmountString | Result<RawAmountString>;
export function rawDivide(params: RawDivideParams) {
  if (params.throwOnError === false) {
    return rawDivideNonThrowing({ ...params, throwOnError: false });
  } else {
    return rawDivideThrowing({ ...params, throwOnError: true });
  }
}
