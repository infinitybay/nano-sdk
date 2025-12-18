import { Nano } from "nano-sdk";

try {
  let result = Nano.Math.rawPlus({ raw: "5", addend: "3" });
  if (Nano.Math.rawIsGreaterThan({ raw: result, compareTo: "5" })) {
    result = Nano.Math.rawMinus({ raw: result, subtrahend: 5n });
    if (Nano.Math.rawIsEqualTo({ raw: result, compareTo: 3n })) {
      console.log("Result:", result); // prints "Result: 3"
    }
  }
} catch (err) {
  console.error("Unexpected failure:", err);
}
