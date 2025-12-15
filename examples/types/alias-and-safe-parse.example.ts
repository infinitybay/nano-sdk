import { Nano } from "nano-sdk";

type AccountString = Nano.Types.AccountString;
const AccountString = Nano.Types.AccountString();

type RawAmountString = Nano.Types.RawAmountString;
const RawAmountString = Nano.Types.RawAmountString();

const a: AccountString = AccountString.safeParse("nano_3t6k35gi95xu6tergt6p69ck76ogmitsa8mnijtpxm9fkcm736xtoncuohr3");
const r: RawAmountString = RawAmountString.safeParse("9000000000000000000000000000000000000");

if (a.success && r.success) {
  console.log("OK");
} else {
  console.error("Invalid input");
}
