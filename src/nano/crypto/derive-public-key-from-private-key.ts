import { Nacl } from "../types/nacl";
import { NonThrowing } from "../types/non-throwing";
import { PrivateKeyString } from "../types/private-key";
import { PublicKeyString } from "../types/public-key";
import { Result } from "../types/result";
import { Throwing } from "../types/throwing";
import { privateKeyToBytes } from "./conversion/private-key-converter";
import { bytesToPublicKey } from "./conversion/public-key-converter";

type DerivePublicKeyFromPrivateKeyParams = {
  privateKey: PrivateKeyString;
} & (Throwing | NonThrowing);

function derivePublicKeyFromPrivateKeyThrowing(
  params: DerivePublicKeyFromPrivateKeyParams & Throwing
): PublicKeyString {
  const validatedPrivateKey = PrivateKeyString().safeParse(params.privateKey);
  if (!validatedPrivateKey.success) {
    throw new Error("Invalid private key value.");
  }

  const privateKeyBytes = privateKeyToBytes({ privateKey: validatedPrivateKey.data, throwOnError: true });

  try {
    return bytesToPublicKey({ publicKeyBytes: Nacl.derivePublicFromSecret(privateKeyBytes), throwOnError: true });
  } catch (err) {
    throw new Error("Failed to derive public key from private key.", { cause: err });
  }
}

function derivePublicKeyFromPrivateKeyNonThrowing(
  params: DerivePublicKeyFromPrivateKeyParams & NonThrowing
): Result<PublicKeyString> {
  try {
    return {
      success: true,
      data: derivePublicKeyFromPrivateKeyThrowing({ ...params, throwOnError: true }),
    };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e : new Error("Unexpected error."),
    };
  }
}

export function derivePublicKeyFromPrivateKey(
  params: DerivePublicKeyFromPrivateKeyParams & NonThrowing
): Result<PublicKeyString>;
export function derivePublicKeyFromPrivateKey(params: DerivePublicKeyFromPrivateKeyParams & Throwing): PublicKeyString;
export function derivePublicKeyFromPrivateKey(
  params: DerivePublicKeyFromPrivateKeyParams
): PublicKeyString | Result<PublicKeyString>;
export function derivePublicKeyFromPrivateKey(params: DerivePublicKeyFromPrivateKeyParams) {
  if (params.throwOnError === false) {
    return derivePublicKeyFromPrivateKeyNonThrowing({ ...params, throwOnError: false });
  } else {
    return derivePublicKeyFromPrivateKeyThrowing({ ...params, throwOnError: true });
  }
}
