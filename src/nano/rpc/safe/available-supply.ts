import { AvailableSupplyRequest } from "../requests/available-supply";
import { AvailableSupplyResponse } from "../responses/available-supply";
import { safePostFunction } from "./post";

export const available_supply = safePostFunction(AvailableSupplyRequest(), AvailableSupplyResponse());
