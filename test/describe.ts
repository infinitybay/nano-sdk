import { extendedLedgerEnabled } from "./integration/config";

export const describeWithExtendedLedger = extendedLedgerEnabled ? describe : describe.skip;
