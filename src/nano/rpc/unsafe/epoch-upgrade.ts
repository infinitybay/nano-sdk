import { EpochUpgradeRequest } from "../requests/epoch-upgrade";
import { EpochUpgradeResponse } from "../responses/epoch-upgrade";
import { postFunction } from "./post";

export const epoch_upgrade = postFunction(EpochUpgradeRequest(), EpochUpgradeResponse());
