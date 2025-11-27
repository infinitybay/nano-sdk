import { UncheckedClearRequest } from "../requests/unchecked-clear";
import { UncheckedClearResponse } from "../responses/unchecked-clear";
import { safePostFunction } from "./post";

export const unchecked_clear = safePostFunction(UncheckedClearRequest(), UncheckedClearResponse());
