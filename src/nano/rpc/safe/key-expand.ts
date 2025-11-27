import { KeyExpandRequest } from "../requests/key-expand";
import { KeyExpandResponse } from "../responses/key-expand";
import { safePostFunction } from "./post";

export const key_expand = safePostFunction(KeyExpandRequest(), KeyExpandResponse());
