import { HashString } from "../types/hash";
import { Nacl } from "../types/nacl";
import { NonThrowing } from "../types/non-throwing";
import { PublicKeyString } from "../types/public-key";
import { PredicateResult } from "../types/result";
import { SignatureString } from "../types/signature";
import { Throwing } from "../types/throwing";
import { hashToBytes } from "./conversion/hash-converter";
import { publicKeyToBytes } from "./conversion/public-key-converter";
import { signatureToBytes } from "./conversion/signature-converter";

type VerifySignatureParams = {
  hash: HashString;
  publicKey: PublicKeyString;
  signature: SignatureString;
} & (Throwing | NonThrowing);

function verifySignatureThrowing(params: VerifySignatureParams & Throwing): boolean {
  const hashBytes = hashToBytes({ hash: params.hash, throwOnError: true });
  const publicKeyBytes = publicKeyToBytes({ publicKey: params.publicKey, throwOnError: true });
  const signatureBytes = signatureToBytes({ signature: params.signature, throwOnError: true });

  try {
    return Nacl.verifyDetached(hashBytes, signatureBytes, publicKeyBytes);
  } catch (err) {
    throw new Error("Failed to verify signature.", { cause: err });
  }
}

function verifySignatureNonThrowing(
  params: VerifySignatureParams & NonThrowing
): PredicateResult<"checked", "validSignature"> {
  try {
    return {
      checked: true,
      validSignature: verifySignatureThrowing({ ...params, throwOnError: true }),
    };
  } catch (e) {
    return {
      checked: false,
      error: e instanceof Error ? e : new Error("Unexpected error."),
    };
  }
}

export function verifySignature(
  params: VerifySignatureParams & NonThrowing
): PredicateResult<"checked", "validSignature">;
export function verifySignature(params: VerifySignatureParams & Throwing): boolean;
export function verifySignature(params: VerifySignatureParams): PredicateResult<"checked", "validSignature"> | boolean;
export function verifySignature(params: VerifySignatureParams) {
  if (params.throwOnError === false) {
    return verifySignatureNonThrowing({ ...params, throwOnError: false });
  } else {
    return verifySignatureThrowing({ ...params, throwOnError: true });
  }
}
