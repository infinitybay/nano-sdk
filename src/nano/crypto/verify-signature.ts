import { HashString } from "../types/hash";
import { Nacl } from "../types/nacl";
import { NonThrowing } from "../types/non-throwing";
import { PublicKeyString } from "../types/public-key";
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
  } catch (_err) {
    throw new Error("Failed to verify signature.");
  }
}

function verifySignatureNonThrowing(params: VerifySignatureParams & NonThrowing): boolean {
  try {
    return verifySignatureThrowing({ ...params, throwOnError: true });
  } catch (_e) {
    return false;
  }
}

export function verifySignature(params: VerifySignatureParams & NonThrowing): boolean;
export function verifySignature(params: VerifySignatureParams & Throwing): boolean;
export function verifySignature(params: VerifySignatureParams): boolean;
export function verifySignature(params: VerifySignatureParams) {
  if (params.throwOnError === true) {
    return verifySignatureThrowing({ ...params, throwOnError: true });
  } else {
    return verifySignatureNonThrowing({ ...params, throwOnError: false });
  }
}
