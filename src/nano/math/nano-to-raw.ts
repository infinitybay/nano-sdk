import { NanoAmountString, RawAmountString } from "../types/amount";
import { NonThrowing } from "../types/non-throwing";
import { Result } from "../types/result";
import { Throwing } from "../types/throwing";
import { MathError } from "./math-error";
import { MathErrorCode } from "./math-error-code";

export type NanoToRawParams = {
  nano: NanoAmountString;
};

export type NanoToRawResult = Result<
  RawAmountString,
  MathError<MathErrorCode.InvalidNano | MathErrorCode.InvalidRawResult | MathErrorCode.Unexpected>
>;

export function nanoToRaw(params: NanoToRawParams & NonThrowing): NanoToRawResult;
export function nanoToRaw(params: NanoToRawParams & Throwing): RawAmountString;
export function nanoToRaw(params: NanoToRawParams & (Throwing | NonThrowing)): RawAmountString | NanoToRawResult;
export function nanoToRaw(params: NanoToRawParams & (Throwing | NonThrowing)) {
  const result = ((): NanoToRawResult => {
    try {
      const nanoResult = NanoAmountString().safeParse(params.nano);
      if (!nanoResult.success) {
        return Result.err(new MathError(MathErrorCode.InvalidNano, "Invalid nano value."));
      }

      const [integerPart, fractionPart = ""] = nanoResult.data.split(".");

      const rawResult = RawAmountString().safeParse(BigInt(`${integerPart}${fractionPart.padEnd(30, "0")}`).toString());
      if (!rawResult.success) {
        return Result.err(new MathError(MathErrorCode.InvalidRawResult, "Invalid raw result."));
      }

      return Result.ok(rawResult.data);
    } catch (e) {
      return Result.err(new MathError(MathErrorCode.Unexpected, "Unexpected error.", { cause: e }));
    }
  })();

  return Result.unwrap(result, params.throwOnError);
}
