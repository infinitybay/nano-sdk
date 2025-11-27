import { KeyCreateRequest } from "../requests/key-create";
import { KeyCreateResponse } from "../responses/key-create";
import { safePostFunction } from "./post";

export const key_create = safePostFunction(KeyCreateRequest(), KeyCreateResponse());
