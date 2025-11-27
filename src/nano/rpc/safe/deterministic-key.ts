import { DeterministicKeyRequest } from "../requests/deterministic-key";
import { DeterministicKeyResponse } from "../responses/deterministic-key";
import { safePostFunction } from "./post";

export const deterministic_key = safePostFunction(DeterministicKeyRequest(), DeterministicKeyResponse());
