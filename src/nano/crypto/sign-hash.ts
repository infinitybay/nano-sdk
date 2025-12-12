import { HashString } from "../types/hash";
import { Nacl } from "../types/nacl";
import { NonThrowing } from "../types/non-throwing";
import { PrivateKeyString } from "../types/private-key";
import { Result } from "../types/result";
import { SignatureString } from "../types/signature";
import { Throwing } from "../types/throwing";
import { hashToBytes } from "./conversion/hash-converter";
import { privateKeyToBytes } from "./conversion/private-key-converter";
import { bytesToSignature } from "./conversion/signature-converter";

type SignHashParams = {
  hash: HashString;
  privateKey: PrivateKeyString;
} & (Throwing | NonThrowing);

function signHashThrowing(params: SignHashParams & Throwing): SignatureString {
  const hashBytes = hashToBytes({ hash: params.hash, throwOnError: true });
  const privateKeyBytes = privateKeyToBytes({ privateKey: params.privateKey, throwOnError: true });

  try {
    const signatureBytes = Nacl.signDetached(hashBytes, privateKeyBytes);
    return bytesToSignature({ signatureBytes, throwOnError: true });
  } catch (_err) {
    throw new Error("Failed to create a valid signature.");
  }
}

function signHashNonThrowing(params: SignHashParams & NonThrowing): Result<SignatureString> {
  try {
    return {
      success: true,
      data: signHashThrowing({ ...params, throwOnError: true }),
    };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e : new Error("Unexpected error."),
    };
  }
}

export function signHash(params: SignHashParams & NonThrowing): Result<SignatureString>;
export function signHash(params: SignHashParams & Throwing): SignatureString;
export function signHash(params: SignHashParams): SignatureString | Result<SignatureString>;
export function signHash(params: SignHashParams) {
  if (params.throwOnError === true) {
    return signHashThrowing({ ...params, throwOnError: true });
  } else {
    return signHashNonThrowing({ ...params, throwOnError: false });
  }
}
