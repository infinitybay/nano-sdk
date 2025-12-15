import { Nano } from "nano-sdk";

const nanoRpcUrl = "http://127.0.0.1:7076";

async function fetchVersion() {
  try {
    const version = await Nano.RPC.version(nanoRpcUrl, { action: "version" }, { timeoutInMs: 2000 });
    console.log("Node Vendor:", version.node_vendor); // prints e.g. "Node Vendor: Nano V28.2"
  } catch (err) {
    if (err instanceof Nano.RPC.PostError) {
      console.error("PostError:", err.message, err.status, err.statusText); // prints details if available
    } else {
      console.error("Unexpected error:", err);
    }
  }
}

fetchVersion();
