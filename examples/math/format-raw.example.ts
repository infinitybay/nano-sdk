import { Nano } from "nano-sdk";

try {
  const formatted = Nano.Math.formatRaw({
    raw: "1234567000000000000000000000000000",
    unit: "nano",
    decimalPlaces: 6,
    decimalSeparator: ".",
    groupingSize: 3,
    groupingSeparator: ",",
  });
  console.log("Nano:", formatted); // prints "Nano: 1,234.567000"

  // Invalid input → throws
  Nano.Math.formatRaw({ raw: "-1" });
} catch (err) {
  console.error("formatRaw failed:", err); // prints "formatRaw failed: Error: Invalid raw value."
}
