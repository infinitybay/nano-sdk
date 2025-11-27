import { KeyCreateRequest } from "../requests/key-create";
import { KeyCreateResponse } from "../responses/key-create";
import { postFunction } from "./post";

export const key_create = postFunction(KeyCreateRequest(), KeyCreateResponse());
