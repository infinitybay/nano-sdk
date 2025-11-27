import { DeterministicKeyRequest } from "../requests/deterministic-key";
import { DeterministicKeyResponse } from "../responses/deterministic-key";
import { postFunction } from "./post";

export const deterministic_key = postFunction(DeterministicKeyRequest(), DeterministicKeyResponse());
