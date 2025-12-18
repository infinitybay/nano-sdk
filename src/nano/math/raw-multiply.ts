import { RawAmount, RawAmountString } from "../types/amount";
import { NonThrowing } from "../types/non-throwing";
import { Result } from "../types/result";
import { Throwing } from "../types/throwing";

type RawMultiplyParams = {
  raw: RawAmount | RawAmountString;
  multiplier: RawAmount | RawAmountString;
};

type RawMultiplyRawAmountParams = {
  raw: RawAmount;
  multiplier: RawAmount | RawAmountString;
};

type RawMultiplyRawAmountStringParams = {
  raw: RawAmountString;
  multiplier: RawAmount | RawAmountString;
};

function rawMultiplyThrowing(params: RawMultiplyRawAmountParams & Throwing): RawAmount;
function rawMultiplyThrowing(params: RawMultiplyRawAmountStringParams & Throwing): RawAmountString;
function rawMultiplyThrowing(params: RawMultiplyParams & Throwing) {
  const baseResult = RawAmount().safeParse(params.raw);
  if (!baseResult.success) {
    throw new Error("Invalid raw value.");
  }

  const multiplierResult = RawAmount().safeParse(params.multiplier);
  if (!multiplierResult.success) {
    throw new Error("Invalid multiplier value.");
  }

  const base = baseResult.data;
  const multiplier = multiplierResult.data;
  const product = base * multiplier;

  const result = RawAmount().safeParse(product);
  if (!result.success) {
    throw new Error("Resulting amount is no valid raw amount.");
  }

  if (typeof params.raw === "bigint") {
    return result.data;
  } else {
    return result.data.toString();
  }
}

function rawMultiplyNonThrowing(params: RawMultiplyRawAmountParams & NonThrowing): Result<RawAmount>;
function rawMultiplyNonThrowing(params: RawMultiplyRawAmountStringParams & NonThrowing): Result<RawAmountString>;
function rawMultiplyNonThrowing(params: RawMultiplyParams & NonThrowing) {
  try {
    let result;
    if (typeof params.raw === "bigint") {
      result = rawMultiplyThrowing({ raw: params.raw, multiplier: params.multiplier, throwOnError: true });
    } else {
      result = rawMultiplyThrowing({ raw: params.raw, multiplier: params.multiplier, throwOnError: true });
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

export function rawMultiply(params: RawMultiplyRawAmountParams & NonThrowing): Result<RawAmount>;
export function rawMultiply(params: RawMultiplyRawAmountParams & Throwing): RawAmount;
export function rawMultiply(params: RawMultiplyRawAmountParams): RawAmount | Result<RawAmount>;
export function rawMultiply(params: RawMultiplyRawAmountStringParams & NonThrowing): Result<RawAmountString>;
export function rawMultiply(params: RawMultiplyRawAmountStringParams & Throwing): RawAmountString;
export function rawMultiply(params: RawMultiplyRawAmountStringParams): RawAmountString | Result<RawAmountString>;
export function rawMultiply(params: RawMultiplyParams & (Throwing | NonThrowing)) {
  if (params.throwOnError === false) {
    if (typeof params.raw === "bigint") {
      return rawMultiplyNonThrowing({ raw: params.raw, multiplier: params.multiplier, throwOnError: false });
    } else {
      return rawMultiplyNonThrowing({ raw: params.raw, multiplier: params.multiplier, throwOnError: false });
    }
  } else {
    if (typeof params.raw === "bigint") {
      return rawMultiplyThrowing({ raw: params.raw, multiplier: params.multiplier, throwOnError: true });
    } else {
      return rawMultiplyThrowing({ raw: params.raw, multiplier: params.multiplier, throwOnError: true });
    }
  }
}
