import { EpochUpgradeRequest } from "../requests/epoch-upgrade";
import { EpochUpgradeResponse } from "../responses/epoch-upgrade";
import { safePostFunction } from "./post";

export const epoch_upgrade = safePostFunction(EpochUpgradeRequest(), EpochUpgradeResponse());
