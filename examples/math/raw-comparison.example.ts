import { Nano } from "nano-sdk";

try {
  let result = Nano.Math.rawPlus({ raw: "5", addend: "3" });
  if (Nano.Math.rawIsGreaterThan({ raw: result, compareTo: "5" })) {
    result = Nano.Math.rawMinus({ raw: result, subtrahend: "5" });
    if (Nano.Math.rawIsEqualTo({ raw: result, compareTo: "3" })) {
      console.log("Result: 3");
    }
  }
} catch (err) {
  console.error("Unexpected failure:", err);
}
