import { ByteArray } from "../../types/byte-array";
import { NonThrowing } from "../../types/non-throwing";
import { Result } from "../../types/result";
import { SignatureString } from "../../types/signature";
import { Throwing } from "../../types/throwing";
import { CryptoError } from "../crypto-error";
import { CryptoErrorCode } from "../crypto-error-code";
import { bytesToHex, hexToBytes } from "./hex-converter";

export type SignatureToBytesParams = {
  signature: SignatureString;
};

export type SignatureToBytesResult = Result<
  Uint8Array,
  CryptoError<CryptoErrorCode.HexToBytesFailed | CryptoErrorCode.InvalidSignature | CryptoErrorCode.Unexpected>
>;

export function signatureToBytes(params: SignatureToBytesParams & NonThrowing): SignatureToBytesResult;
export function signatureToBytes(params: SignatureToBytesParams & Throwing): Uint8Array;
export function signatureToBytes(
  params: SignatureToBytesParams & (Throwing | NonThrowing)
): Uint8Array | SignatureToBytesResult;
export function signatureToBytes(params: SignatureToBytesParams & (Throwing | NonThrowing)) {
  const result = ((): SignatureToBytesResult => {
    try {
      const validatedSignature = SignatureString().safeParse(params.signature);
      if (!validatedSignature.success) {
        return Result.err(new CryptoError(CryptoErrorCode.InvalidSignature, "Invalid signature value."));
      }

      const bytesResult = hexToBytes({ hex: validatedSignature.data, throwOnError: false });
      if (!bytesResult.success) {
        return Result.err(
          new CryptoError(CryptoErrorCode.HexToBytesFailed, "Failed to convert signature hex to bytes.", {
            cause: bytesResult.error,
          })
        );
      }

      return Result.ok(bytesResult.data);
    } catch (e) {
      return Result.err(new CryptoError(CryptoErrorCode.Unexpected, "Unexpected error.", { cause: e }));
    }
  })();

  return Result.unwrap(result, params.throwOnError);
}

export type BytesToSignatureParams = {
  signatureBytes: Uint8Array;
};

export type BytesToSignatureResult = Result<
  SignatureString,
  CryptoError<
    | CryptoErrorCode.BytesToHexFailed
    | CryptoErrorCode.InvalidBytes
    | CryptoErrorCode.InvalidSignatureBytes
    | CryptoErrorCode.Unexpected
  >
>;

export function bytesToSignature(params: BytesToSignatureParams & NonThrowing): BytesToSignatureResult;
export function bytesToSignature(params: BytesToSignatureParams & Throwing): SignatureString;
export function bytesToSignature(
  params: BytesToSignatureParams & (Throwing | NonThrowing)
): SignatureString | BytesToSignatureResult;
export function bytesToSignature(params: BytesToSignatureParams & (Throwing | NonThrowing)) {
  const result = ((): BytesToSignatureResult => {
    try {
      const bytesResult = ByteArray().safeParse(params.signatureBytes);
      if (!bytesResult.success) {
        return Result.err(new CryptoError(CryptoErrorCode.InvalidBytes, "Invalid bytes value."));
      }

      const hexResult = bytesToHex({ bytes: bytesResult.data, throwOnError: false });
      if (!hexResult.success) {
        return Result.err(
          new CryptoError(CryptoErrorCode.BytesToHexFailed, "Failed to convert signature bytes to hex.", {
            cause: hexResult.error,
          })
        );
      }

      const signatureResult = SignatureString().safeParse(hexResult.data);
      if (!signatureResult.success) {
        return Result.err(new CryptoError(CryptoErrorCode.InvalidSignatureBytes, "Invalid signature byte array."));
      }

      return Result.ok(signatureResult.data);
    } catch (e) {
      return Result.err(new CryptoError(CryptoErrorCode.Unexpected, "Unexpected error.", { cause: e }));
    }
  })();

  return Result.unwrap(result, params.throwOnError);
}
