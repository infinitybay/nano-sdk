import { postFunction } from "../http/post";
import { NanoToRawRequest } from "../requests/nano-to-raw";
import { NanoToRawResponse } from "../responses/nano-to-raw";

export const nano_to_raw = postFunction(NanoToRawRequest(), NanoToRawResponse());
