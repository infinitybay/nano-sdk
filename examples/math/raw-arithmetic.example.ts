import { Nano } from "nano-sdk";

try {
  let result = "5";
  result = Nano.Math.rawPlus({ raw: result, addend: "3" });
  result = Nano.Math.rawMinus({ raw: result, subtrahend: "4" });
  result = Nano.Math.rawMultiply({ raw: result, multiplier: "10" });
  result = Nano.Math.rawDivide({ raw: result, divisor: "2" });
  console.log("Result:", result); // prints "Result: 20"
} catch (err) {
  console.error("Unexpected failure:", err);
}
