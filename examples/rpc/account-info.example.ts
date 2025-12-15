import { Nano } from "nano-sdk";

const nanoRpcUrl = "http://127.0.0.1:7076";

async function fetchAccountInfo(account: Nano.Types.AccountString) {
  const response = await Nano.RPC.account_info(
    nanoRpcUrl,
    {
      action: "account_info",
      account: account,
      representative: true,
      weight: true
    },
    { timeoutInMs: 2000 }
  );

  console.log("Representative:", response.representative); // prints "Representative: nano_3t6k35gi95xu6tergt6p69ck76ogmitsa8mnijtpxm9fkcm736xtoncuohr3"
  console.log("Weight:", response.weight); // prints "Weight: 87512150968755586912977757698476"
}

fetchAccountInfo("nano_3t6k35gi95xu6tergt6p69ck76ogmitsa8mnijtpxm9fkcm736xtoncuohr3").catch((err) => console.error("Unexpected failure:", err));
