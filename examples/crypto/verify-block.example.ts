import { Nano } from "nano-sdk";

const stateBlock: Nano.Blocks.StateBlock = {
  type: "state",
  account: "nano_3fundme3zgwcezey4wo1auae1o16yjds7gw8f9bpke4hrzks966i5qpkycxw",
  previous: "0000000000000000000000000000000000000000000000000000000000000000",
  representative: "nano_1iuz18n4g4wfp9gf7p1s8qkygxw7wx9qfjq6a9aq68uyrdnningdcjontgar",
  balance: "25000000000000000000000000000000000",
  link: "F125AC1EC9C360E5FE76B8EDEE8B41C346F5CD479C410F4B6ED2EDCDFE089B48",
  link_as_account: "nano_3wb7oihemiu1wqz9fg9fxt7n5it8yq8nh9433x7pxnqfsqz1j8taj7t1xtnf",
  signature: "3E70092AE5C01E33C09EEF4E9889D589CCCCFDF51E4E189B8ABCDE5E7C426FE2ECD3619434C6EB01E57F656968A974C88DDC7416F6EE87ED26E52500DBF15503",
  work: "e36efaf24804b3ee"
};

try {
  // Verifies the block signature using the public key derived from block.account
  let validBlock = Nano.Crypto.verifyBlock({ block: stateBlock });
  console.log("Valid Block:", validBlock); // prints "Valid Block: true"

  // Explicitly provide a public key (defaults to the one derived from block.account if omitted)
  validBlock = Nano.Crypto.verifyBlock({ block: stateBlock, publicKey: Nano.Crypto.derivePublicKeyFromAccount({ account: stateBlock.account }) });
  console.log("Valid Block:", validBlock); // prints "Valid Block: true"

  // Modify link_as_account so it no longer matches the block.link
  stateBlock.link_as_account = "nano_3fundme3zgwcezey4wo1auae1o16yjds7gw8f9bpke4hrzks966i5qpkycxw";
  validBlock = Nano.Crypto.verifyBlock({ block: stateBlock });
  console.log("Valid Block:", validBlock); // prints "Valid Block: false"

  // Update link accordingly, making the signature itself invalid
  stateBlock.link = Nano.Crypto.derivePublicKeyFromAccount({ account: stateBlock.link_as_account });
  validBlock = Nano.Crypto.verifyBlock({ block: stateBlock });
  console.log("Valid Block:", validBlock); // prints "Valid Block: false"
} catch (err) {
  console.error("Unexpected failure:", err);
}
