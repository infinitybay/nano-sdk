import { Nano } from "nano-sdk";

type RawAmount = Nano.Types.RawAmount;
const RawAmount = Nano.Types.RawAmount();

type RawAmountString = Nano.Types.RawAmountString;
const RawAmountString = Nano.Types.RawAmountString();

try {
  const amount1: RawAmount = RawAmount.parse(100);
  const amount2: RawAmount = RawAmount.parse(100n);
  const amount3: RawAmount = RawAmount.parse("100");
  const result1 = RawAmount.parse(amount1 + amount2 + amount3 - 50n);
  console.log("Result1:", result1.toString()); // prints "Result: 250"

  let result2: RawAmountString = RawAmountString.parse("5");
  result2 = Nano.Math.rawPlus({ raw: result2, addend: amount1 });
  result2 = Nano.Math.rawMinus({ raw: result2, subtrahend: "5" });
  result2 = Nano.Math.rawMultiply({ raw: result2, multiplier: 10n });
  result2 = Nano.Math.rawDivide({ raw: result2, divisor: 2n });
  console.log("Result2:", result2); // prints "Result: 500"
} catch (err) {
  console.error("Unexpected failure:", err);
}
