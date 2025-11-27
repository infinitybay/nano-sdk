import { UncheckedClearRequest } from "../requests/unchecked-clear";
import { UncheckedClearResponse } from "../responses/unchecked-clear";
import { postFunction } from "./post";

export const unchecked_clear = postFunction(UncheckedClearRequest(), UncheckedClearResponse());
