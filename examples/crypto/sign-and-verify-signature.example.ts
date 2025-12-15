import { Nano } from "nano-sdk";

const hash: Nano.Types.HashString = "523F8240320ACA742BEE4A1223FFE35E5B88BFAA2D179E89AD71A5C9A3AE456C";
const publicKey: Nano.Types.PublicKeyString = "BBF2EC92A246D0A2348EB0078E865D3D19C1B884693D5BFF660B7A536A03D629";
const privateKey: Nano.Types.PrivateKeyString = "B7DDAF5DDE0169C84A904909CC6C206B4EE32493E7B549A95900B5D2E5C78BFA";

try {
  const signature = Nano.Crypto.signHash({ hash, privateKey });
  const validSignature = Nano.Crypto.verifySignature({ hash, publicKey, signature });
  console.log("Valid Signature:", validSignature); // prints "Valid Signature: true"
} catch (err) {
  console.error("Unexpected failure:", err);
}
