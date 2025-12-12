import { postFunction } from "../http/post";
import { AvailableSupplyRequest } from "../requests/available-supply";
import { AvailableSupplyResponse } from "../responses/available-supply";

export const available_supply = postFunction(AvailableSupplyRequest(), AvailableSupplyResponse());
