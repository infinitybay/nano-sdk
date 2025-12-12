import { postFunction } from "../http/post";
import { DeterministicKeyRequest } from "../requests/deterministic-key";
import { DeterministicKeyResponse } from "../responses/deterministic-key";

export const deterministic_key = postFunction(DeterministicKeyRequest(), DeterministicKeyResponse());
