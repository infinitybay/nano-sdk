import { Nano } from "nano-sdk";

try {
  const formatted1 = Nano.Math.formatRaw({
    raw: "1234567000000000000000000000000000",
    unit: "nano",
    decimalPlaces: 6,
    decimalSeparator: ".",
    groupingSize: 3,
    groupingSeparator: ",",
  });
  console.log("Nano:", formatted1); // prints "Nano: 1,234.567000"
} catch (err) {
  console.error("Unexpected failure:", err);
}
