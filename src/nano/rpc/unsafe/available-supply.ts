import { AvailableSupplyRequest } from "../requests/available-supply";
import { AvailableSupplyResponse } from "../responses/available-supply";
import { postFunction } from "./post";

export const available_supply = postFunction(AvailableSupplyRequest(), AvailableSupplyResponse());
