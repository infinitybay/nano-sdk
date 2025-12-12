import { postFunction } from "../http/post";
import { KeyExpandRequest } from "../requests/key-expand";
import { KeyExpandResponse } from "../responses/key-expand";

export const key_expand = postFunction(KeyExpandRequest(), KeyExpandResponse());
