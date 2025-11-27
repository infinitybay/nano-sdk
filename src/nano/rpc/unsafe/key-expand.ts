import { KeyExpandRequest } from "../requests/key-expand";
import { KeyExpandResponse } from "../responses/key-expand";
import { postFunction } from "./post";

export const key_expand = postFunction(KeyExpandRequest(), KeyExpandResponse());
