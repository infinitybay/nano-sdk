import { RawAmount, RawAmountString } from "../types/amount";
import { NonThrowing } from "../types/non-throwing";
import { Result } from "../types/result";
import { Throwing } from "../types/throwing";

type RawMinusParams = {
  raw: RawAmount | RawAmountString;
  subtrahend: RawAmount | RawAmountString;
};

type RawMinusRawAmountParams = {
  raw: RawAmount;
  subtrahend: RawAmount | RawAmountString;
};

type RawMinusRawAmountStringParams = {
  raw: RawAmountString;
  subtrahend: RawAmount | RawAmountString;
};

function rawMinusThrowing(params: RawMinusRawAmountParams & Throwing): RawAmount;
function rawMinusThrowing(params: RawMinusRawAmountStringParams & Throwing): RawAmountString;
function rawMinusThrowing(params: RawMinusParams & Throwing) {
  const baseResult = RawAmount().safeParse(params.raw);
  if (!baseResult.success) {
    throw new Error("Invalid raw value.");
  }

  const subtrahendResult = RawAmount().safeParse(params.subtrahend);
  if (!subtrahendResult.success) {
    throw new Error("Invalid subtrahend value.");
  }

  const base = baseResult.data;
  const subtrahend = subtrahendResult.data;
  const difference = base - subtrahend;

  const result = RawAmount().safeParse(difference);
  if (!result.success) {
    throw new Error("Resulting amount is no valid raw amount.");
  }

  if (typeof params.raw === "bigint") {
    return result.data;
  } else {
    return result.data.toString();
  }
}

function rawMinusNonThrowing(params: RawMinusRawAmountParams & NonThrowing): Result<RawAmount>;
function rawMinusNonThrowing(params: RawMinusRawAmountStringParams & NonThrowing): Result<RawAmountString>;
function rawMinusNonThrowing(params: RawMinusParams & NonThrowing) {
  try {
    let result;
    if (typeof params.raw === "bigint") {
      result = rawMinusThrowing({ raw: params.raw, subtrahend: params.subtrahend, throwOnError: true });
    } else {
      result = rawMinusThrowing({ raw: params.raw, subtrahend: params.subtrahend, throwOnError: true });
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

export function rawMinus(params: RawMinusRawAmountParams & NonThrowing): Result<RawAmount>;
export function rawMinus(params: RawMinusRawAmountParams & Throwing): RawAmount;
export function rawMinus(params: RawMinusRawAmountParams): RawAmount | Result<RawAmount>;
export function rawMinus(params: RawMinusRawAmountStringParams & NonThrowing): Result<RawAmountString>;
export function rawMinus(params: RawMinusRawAmountStringParams & Throwing): RawAmountString;
export function rawMinus(params: RawMinusRawAmountStringParams): RawAmountString | Result<RawAmountString>;
export function rawMinus(params: RawMinusParams & (Throwing | NonThrowing)) {
  if (params.throwOnError === false) {
    if (typeof params.raw === "bigint") {
      return rawMinusNonThrowing({ raw: params.raw, subtrahend: params.subtrahend, throwOnError: false });
    } else {
      return rawMinusNonThrowing({ raw: params.raw, subtrahend: params.subtrahend, throwOnError: false });
    }
  } else {
    if (typeof params.raw === "bigint") {
      return rawMinusThrowing({ raw: params.raw, subtrahend: params.subtrahend, throwOnError: true });
    } else {
      return rawMinusThrowing({ raw: params.raw, subtrahend: params.subtrahend, throwOnError: true });
    }
  }
}
