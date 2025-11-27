import { NanoToRawRequest } from "../requests/nano-to-raw";
import { NanoToRawResponse } from "../responses/nano-to-raw";
import { safePostFunction } from "./post";

export const nano_to_raw = safePostFunction(NanoToRawRequest(), NanoToRawResponse());
