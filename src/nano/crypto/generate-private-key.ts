import { NonThrowing } from "../types/non-throwing";
import { PrivateKeyString } from "../types/private-key";
import { Result } from "../types/result";
import { Throwing } from "../types/throwing";
import { generateSeed } from "./generate-seed";

type GeneratePrivateKeyParams = {} & (Throwing | NonThrowing);

function generatePrivateKeyThrowing(_params: GeneratePrivateKeyParams & Throwing): PrivateKeyString {
  const privateKeyResult = PrivateKeyString().safeParse(generateSeed({ throwOnError: true }));
  if (!privateKeyResult.success) {
    throw new Error("Generated private key is invalid.");
  }
  return privateKeyResult.data;
}

function generatePrivateKeyNonThrowing(params: GeneratePrivateKeyParams & NonThrowing): Result<PrivateKeyString> {
  try {
    return {
      success: true,
      data: generatePrivateKeyThrowing({ ...params, throwOnError: true }),
    };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e : new Error("Unexpected error."),
    };
  }
}

export function generatePrivateKey(params: GeneratePrivateKeyParams & NonThrowing): Result<PrivateKeyString>;
export function generatePrivateKey(params: GeneratePrivateKeyParams & Throwing): PrivateKeyString;
export function generatePrivateKey(params: GeneratePrivateKeyParams): PrivateKeyString | Result<PrivateKeyString>;
export function generatePrivateKey(params: GeneratePrivateKeyParams = {}) {
  if (params.throwOnError === false) {
    return generatePrivateKeyNonThrowing({ ...params, throwOnError: false });
  } else {
    return generatePrivateKeyThrowing({ ...params, throwOnError: true });
  }
}
