import { RawAmount, RawAmountString } from "../types/amount";
import { NonThrowing } from "../types/non-throwing";
import { Result } from "../types/result";
import { Throwing } from "../types/throwing";

type RawPlusParams = {
  raw: RawAmount | RawAmountString;
  addend: RawAmount | RawAmountString;
};

type RawPlusRawAmountParams = {
  raw: RawAmount;
  addend: RawAmount | RawAmountString;
};

type RawPlusRawAmountStringParams = {
  raw: RawAmountString;
  addend: RawAmount | RawAmountString;
};

function rawPlusThrowing(params: RawPlusRawAmountParams & Throwing): RawAmount;
function rawPlusThrowing(params: RawPlusRawAmountStringParams & Throwing): RawAmountString;
function rawPlusThrowing(params: RawPlusParams & Throwing) {
  if (
    (typeof params.raw === "bigint" && params.raw < 0n) ||
    (typeof params.raw === "string" && params.raw.startsWith("-"))
  ) {
    throw new Error("Invalid raw value: negative raw amounts are not allowed.");
  }

  const baseResult = RawAmount().safeParse(params.raw);
  if (!baseResult.success) {
    throw new Error("Invalid raw value.");
  }

  if (
    (typeof params.addend === "bigint" && params.addend < 0n) ||
    (typeof params.addend === "string" && params.addend.startsWith("-"))
  ) {
    throw new Error("Invalid addend value: negative raw amounts are not allowed.");
  }

  const addendResult = RawAmount().safeParse(params.addend);
  if (!addendResult.success) {
    throw new Error("Invalid addend value.");
  }

  const base = baseResult.data;
  const addend = addendResult.data;
  const sum = base + addend;

  const result = RawAmount().safeParse(sum);
  if (!result.success) {
    throw new Error("Resulting amount is no valid raw amount.");
  }

  if (typeof params.raw === "bigint") {
    return result.data;
  } else {
    return result.data.toString();
  }
}

function rawPlusNonThrowing(params: RawPlusRawAmountParams & NonThrowing): Result<RawAmount>;
function rawPlusNonThrowing(params: RawPlusRawAmountStringParams & NonThrowing): Result<RawAmountString>;
function rawPlusNonThrowing(params: RawPlusParams & NonThrowing) {
  try {
    let result;
    if (typeof params.raw === "bigint") {
      result = rawPlusThrowing({ raw: params.raw, addend: params.addend, throwOnError: true });
    } else {
      result = rawPlusThrowing({ raw: params.raw, addend: params.addend, throwOnError: true });
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

export function rawPlus(params: RawPlusRawAmountParams & NonThrowing): Result<RawAmount>;
export function rawPlus(params: RawPlusRawAmountParams & Throwing): RawAmount;
export function rawPlus(params: RawPlusRawAmountParams): RawAmount | Result<RawAmount>;
export function rawPlus(params: RawPlusRawAmountStringParams & NonThrowing): Result<RawAmountString>;
export function rawPlus(params: RawPlusRawAmountStringParams & Throwing): RawAmountString;
export function rawPlus(params: RawPlusRawAmountStringParams): RawAmountString | Result<RawAmountString>;
export function rawPlus(params: RawPlusParams & (Throwing | NonThrowing)) {
  if (params.throwOnError === false) {
    if (typeof params.raw === "bigint") {
      return rawPlusNonThrowing({ raw: params.raw, addend: params.addend, throwOnError: false });
    } else {
      return rawPlusNonThrowing({ raw: params.raw, addend: params.addend, throwOnError: false });
    }
  } else {
    if (typeof params.raw === "bigint") {
      return rawPlusThrowing({ raw: params.raw, addend: params.addend, throwOnError: true });
    } else {
      return rawPlusThrowing({ raw: params.raw, addend: params.addend, throwOnError: true });
    }
  }
}
