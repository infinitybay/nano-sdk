import { Nano } from "nano-sdk";

try {
  const seed = Nano.Crypto.generateSeed();
  console.log("Seed:", seed);

  const privateKey = Nano.Crypto.derivePrivateKeyFromSeed({ seed, seedIndex: 0 });
  console.log("PrivateKey:", privateKey);

  const publicKey = Nano.Crypto.derivePublicKeyFromPrivateKey({ privateKey });
  console.log("PublicKey:", publicKey);

  const account = Nano.Crypto.deriveAccountFromPublicKey({ publicKey });
  console.log("Account:", account);
} catch (err) {
  console.error("Unexpected failure:", err);
}
