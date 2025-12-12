import { postFunction } from "../http/post";
import { RawToNanoRequest } from "../requests/raw-to-nano";
import { RawToNanoResponse } from "../responses/raw-to-nano";

export const raw_to_nano = postFunction(RawToNanoRequest(), RawToNanoResponse());
