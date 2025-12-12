import { NonThrowing } from "../types/non-throwing";
import { PublicKeyString } from "../types/public-key";
import { Result } from "../types/result";
import { Throwing } from "../types/throwing";
import { derivePublicKeyFromPrivateKey } from "./derive-public-key-from-private-key";
import { generatePrivateKey } from "./generate-private-key";

type GeneratePublicKeyParams = {} & (Throwing | NonThrowing);

function generatePublicKeyThrowing(_params: GeneratePublicKeyParams & Throwing): PublicKeyString {
  const privateKey = generatePrivateKey({ throwOnError: true });
  return derivePublicKeyFromPrivateKey({ privateKey, throwOnError: true });
}

function generatePublicKeyNonThrowing(params: GeneratePublicKeyParams & NonThrowing): Result<PublicKeyString> {
  try {
    return {
      success: true,
      data: generatePublicKeyThrowing({ ...params, throwOnError: true }),
    };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e : new Error("Unexpected error."),
    };
  }
}

export function generatePublicKey(params: GeneratePublicKeyParams & NonThrowing): Result<PublicKeyString>;
export function generatePublicKey(params: GeneratePublicKeyParams & Throwing): PublicKeyString;
export function generatePublicKey(params: GeneratePublicKeyParams): PublicKeyString | Result<PublicKeyString>;
export function generatePublicKey(params: GeneratePublicKeyParams = { throwOnError: false }) {
  if (params.throwOnError === true) {
    return generatePublicKeyThrowing({ ...params, throwOnError: true });
  } else {
    return generatePublicKeyNonThrowing({ ...params, throwOnError: false });
  }
}
