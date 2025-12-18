import { RawAmount, RawAmountString } from "../types/amount";
import { NonThrowing } from "../types/non-throwing";
import { Result } from "../types/result";
import { Throwing } from "../types/throwing";

type RawModuloParams = {
  raw: RawAmount | RawAmountString;
  divisor: RawAmount | RawAmountString;
};

type RawModuloRawAmountParams = {
  raw: RawAmount;
  divisor: RawAmount | RawAmountString;
};

type RawModuloRawAmountStringParams = {
  raw: RawAmountString;
  divisor: RawAmount | RawAmountString;
};

function rawModuloThrowing(params: RawModuloRawAmountParams & Throwing): RawAmount;
function rawModuloThrowing(params: RawModuloRawAmountStringParams & Throwing): RawAmountString;
function rawModuloThrowing(params: RawModuloParams & Throwing) {
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

  const remainder = dividend % divisor;

  const result = RawAmount().safeParse(remainder);
  if (!result.success) {
    throw new Error("Resulting amount is no valid raw amount.");
  }

  if (typeof params.raw === "bigint") {
    return result.data;
  } else {
    return result.data.toString();
  }
}

function rawModuloNonThrowing(params: RawModuloRawAmountParams & NonThrowing): Result<RawAmount>;
function rawModuloNonThrowing(params: RawModuloRawAmountStringParams & NonThrowing): Result<RawAmountString>;
function rawModuloNonThrowing(params: RawModuloParams & NonThrowing) {
  try {
    let result;
    if (typeof params.raw === "bigint") {
      result = rawModuloThrowing({ raw: params.raw, divisor: params.divisor, throwOnError: true });
    } else {
      result = rawModuloThrowing({ raw: params.raw, divisor: params.divisor, throwOnError: true });
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

export function rawModulo(params: RawModuloRawAmountParams & NonThrowing): Result<RawAmount>;
export function rawModulo(params: RawModuloRawAmountParams & Throwing): RawAmount;
export function rawModulo(params: RawModuloRawAmountParams): RawAmount | Result<RawAmount>;
export function rawModulo(params: RawModuloRawAmountStringParams & NonThrowing): Result<RawAmountString>;
export function rawModulo(params: RawModuloRawAmountStringParams & Throwing): RawAmountString;
export function rawModulo(params: RawModuloRawAmountStringParams): RawAmountString | Result<RawAmountString>;
export function rawModulo(params: RawModuloParams & (Throwing | NonThrowing)) {
  if (params.throwOnError === false) {
    if (typeof params.raw === "bigint") {
      return rawModuloNonThrowing({ raw: params.raw, divisor: params.divisor, throwOnError: false });
    } else {
      return rawModuloNonThrowing({ raw: params.raw, divisor: params.divisor, throwOnError: false });
    }
  } else {
    if (typeof params.raw === "bigint") {
      return rawModuloThrowing({ raw: params.raw, divisor: params.divisor, throwOnError: true });
    } else {
      return rawModuloThrowing({ raw: params.raw, divisor: params.divisor, throwOnError: true });
    }
  }
}
