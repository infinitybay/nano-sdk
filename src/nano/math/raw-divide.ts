import { RawAmount, RawAmountString } from "../types/amount";
import { NonThrowing } from "../types/non-throwing";
import { Result } from "../types/result";
import { Throwing } from "../types/throwing";

type RawDivideParams = {
  raw: RawAmount | RawAmountString;
  divisor: RawAmount | RawAmountString;
};

type RawDivideRawAmountParams = {
  raw: RawAmount;
  divisor: RawAmount | RawAmountString;
};

type RawDivideRawAmountStringParams = {
  raw: RawAmountString;
  divisor: RawAmount | RawAmountString;
};

function rawDivideThrowing(params: RawDivideRawAmountParams & Throwing): RawAmount;
function rawDivideThrowing(params: RawDivideRawAmountStringParams & Throwing): RawAmountString;
function rawDivideThrowing(params: RawDivideParams & Throwing) {
  const dividendResult = RawAmount().safeParse(params.raw);
  if (!dividendResult.success) {
    throw new Error("Invalid raw value.");
  }

  const divisorResult = RawAmount().safeParse(params.divisor);
  if (!divisorResult.success) {
    throw new Error("Invalid divisor value.");
  }

  const dividend = dividendResult.data;
  const divisor = divisorResult.data;

  if (divisor === 0n) {
    throw new Error("Division by zero is not allowed.");
  }

  const quotient = dividend / divisor;
  const remainder = dividend % divisor;

  if (remainder !== 0n) {
    throw new Error("Resulting amount must be an integer.");
  }

  const result = RawAmount().safeParse(quotient);
  if (!result.success) {
    throw new Error("Resulting amount is no valid raw amount.");
  }

  if (typeof params.raw === "bigint") {
    return result.data;
  } else {
    return result.data.toString();
  }
}

function rawDivideNonThrowing(params: RawDivideRawAmountParams & NonThrowing): Result<RawAmount>;
function rawDivideNonThrowing(params: RawDivideRawAmountStringParams & NonThrowing): Result<RawAmountString>;
function rawDivideNonThrowing(params: RawDivideParams & NonThrowing) {
  try {
    let result;
    if (typeof params.raw === "bigint") {
      result = rawDivideThrowing({ raw: params.raw, divisor: params.divisor, throwOnError: true });
    } else {
      result = rawDivideThrowing({ raw: params.raw, divisor: params.divisor, throwOnError: true });
    }
    return {
      success: true,
      data: result,
    };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e : new Error("Unexpected error."),
    };
  }
}

export function rawDivide(params: RawDivideRawAmountParams & NonThrowing): Result<RawAmount>;
export function rawDivide(params: RawDivideRawAmountParams & Throwing): RawAmount;
export function rawDivide(params: RawDivideRawAmountParams): RawAmount | Result<RawAmount>;
export function rawDivide(params: RawDivideRawAmountStringParams & NonThrowing): Result<RawAmountString>;
export function rawDivide(params: RawDivideRawAmountStringParams & Throwing): RawAmountString;
export function rawDivide(params: RawDivideRawAmountStringParams): RawAmountString | Result<RawAmountString>;
export function rawDivide(params: RawDivideParams & (Throwing | NonThrowing)) {
  if (params.throwOnError === false) {
    if (typeof params.raw === "bigint") {
      return rawDivideNonThrowing({ raw: params.raw, divisor: params.divisor, throwOnError: false });
    } else {
      return rawDivideNonThrowing({ raw: params.raw, divisor: params.divisor, throwOnError: false });
    }
  } else {
    if (typeof params.raw === "bigint") {
      return rawDivideThrowing({ raw: params.raw, divisor: params.divisor, throwOnError: true });
    } else {
      return rawDivideThrowing({ raw: params.raw, divisor: params.divisor, throwOnError: true });
    }
  }
}
