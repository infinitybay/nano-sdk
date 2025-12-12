import { postFunction } from "../http/post";
import { UncheckedClearRequest } from "../requests/unchecked-clear";
import { UncheckedClearResponse } from "../responses/unchecked-clear";

export const unchecked_clear = postFunction(UncheckedClearRequest(), UncheckedClearResponse());
