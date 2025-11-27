import { NanoToRawRequest } from "../requests/nano-to-raw";
import { NanoToRawResponse } from "../responses/nano-to-raw";
import { postFunction } from "./post";

export const nano_to_raw = postFunction(NanoToRawRequest(), NanoToRawResponse());
