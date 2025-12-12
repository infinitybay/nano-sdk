import { postFunction } from "../http/post";
import { EpochUpgradeRequest } from "../requests/epoch-upgrade";
import { EpochUpgradeResponse } from "../responses/epoch-upgrade";

export const epoch_upgrade = postFunction(EpochUpgradeRequest(), EpochUpgradeResponse());
