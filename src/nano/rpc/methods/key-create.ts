import { postFunction } from "../http/post";
import { KeyCreateRequest } from "../requests/key-create";
import { KeyCreateResponse } from "../responses/key-create";

export const key_create = postFunction(KeyCreateRequest(), KeyCreateResponse());
