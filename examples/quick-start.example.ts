import { Nano } from "nano-sdk";

const nanoRpcUrl = "http://127.0.0.1:7076";

// Alias
type AccountString = Nano.Types.AccountString;
const AccountString = Nano.Types.AccountString();

async function fetchAccountBalance(account: AccountString) {
  // 1) Validate user input
  const validatedAccount = AccountString.parse(account);

  // 2) Typed RPC call
  const response = await Nano.RPC.account_balance(
    nanoRpcUrl,
    {
      action: "account_balance",
      account: validatedAccount,
      include_only_confirmed: true,
    },
    { timeoutInMs: 2000 }
  );

  // 3) Convert and format raw balance
  const balanceInNano = Nano.Math.rawToNano({ raw: response.balance, decimalPlaces: 6 });

  // 4) Output balanceInNano
  console.log("Balance (Nano):", balanceInNano);
}

fetchAccountBalance("nano_3t6k35gi95xu6tergt6p69ck76ogmitsa8mnijtpxm9fkcm736xtoncuohr3").catch((err) => console.error("Unexpected failure:", err));
