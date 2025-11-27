import BigNumber from "bignumber.js";
import { z } from "zod";

import { Result } from "./result";

const InternalAmount = BigNumber.clone({
  EXPONENTIAL_AT: 1e9,
  DECIMAL_PLACES: 30,
});

const INTERNAL_AMOUNT_IN_RAW_MIN = new InternalAmount("0");
const INTERNAL_AMOUNT_IN_RAW_MAX = new InternalAmount("340282366920938463463374607431768211455"); // 2^128 - 1

const INTERNAL_AMOUNT_IN_NANO_MIN = new InternalAmount("0");
const INTERNAL_AMOUNT_IN_NANO_MAX = new InternalAmount("340282366.920938463463374607431768211455");

export enum AmountUnit {
  Raw = "RAW",
  Nano = "NANO",
}

export type RawAmountString = z.infer<ReturnType<typeof RawAmountString>>;
export const RawAmountString = () =>
  z.string().refine((val) => Amount.safeParse(val, AmountUnit.Raw).success === true, {
    message: "Invalid raw amount!",
  });

export type NanoAmountString = z.infer<ReturnType<typeof NanoAmountString>>;
export const NanoAmountString = () =>
  z.string().refine((val) => Amount.safeParse(val, AmountUnit.Nano).success === true, {
    message: "Invalid nano amount!",
  });

export type AmountString = z.infer<ReturnType<typeof AmountString>>;
export const AmountString = () => RawAmountString().or(NanoAmountString());

export class Amount {
  private value: BigNumber;

  private static minAmount: Amount = new Amount(INTERNAL_AMOUNT_IN_RAW_MIN);
  private static maxAmount: Amount = new Amount(INTERNAL_AMOUNT_IN_RAW_MAX);
  private static zeroAmount: Amount = new Amount(new InternalAmount("0"));

  private constructor(value: BigNumber | number | string) {
    this.value = value instanceof BigNumber ? value : new InternalAmount(value);
  }

  static parse(value: Amount | number | string, unit: AmountUnit = AmountUnit.Raw): Amount {
    switch (unit) {
      case AmountUnit.Raw:
        return new Amount(
          this.parseInternalAmountInRaw(value instanceof Amount ? value.toString(AmountUnit.Raw) : value)
        );
      case AmountUnit.Nano: {
        const internalAmountInNano = this.parseInternalAmountInNano(
          value instanceof Amount ? value.toString(AmountUnit.Nano) : value
        );
        const internalAmountInRaw = this.parseInternalAmountInRaw(internalAmountInNano.shiftedBy(30));
        return new Amount(internalAmountInRaw);
      }
    }
  }

  static safeParse(value: Amount | number | string, unit: AmountUnit = AmountUnit.Raw): Result<Amount> {
    try {
      return { success: true, data: this.parse(value, unit) };
    } catch (err) {
      if (err instanceof Error) {
        return { success: false, error: err };
      }
      return { success: false, error: new Error("Parsing failed.") };
    }
  }

  private static parseInternalAmountInNano(value: BigNumber | number | string): BigNumber {
    const internalAmountInNano = new InternalAmount(value);
    if (!internalAmountInNano.isFinite()) {
      throw new Error("Amount is not finite!");
    }
    if (internalAmountInNano.isLessThan(INTERNAL_AMOUNT_IN_NANO_MIN)) {
      throw new Error(`Amount is less than ${INTERNAL_AMOUNT_IN_RAW_MIN}!`);
    }
    if (internalAmountInNano.isGreaterThan(INTERNAL_AMOUNT_IN_NANO_MAX)) {
      throw new Error(`Amount is greater than ${INTERNAL_AMOUNT_IN_RAW_MAX}!`);
    }
    return internalAmountInNano;
  }

  private static parseInternalAmountInRaw(value: BigNumber | number | string): BigNumber {
    const internalAmountInRaw = new InternalAmount(value);
    if (!internalAmountInRaw.isFinite()) {
      throw new Error("Amount is not finite!");
    }
    if (internalAmountInRaw.isLessThan(INTERNAL_AMOUNT_IN_RAW_MIN)) {
      throw new Error(`Amount is less than ${INTERNAL_AMOUNT_IN_RAW_MIN}!`);
    }
    if (internalAmountInRaw.isGreaterThan(INTERNAL_AMOUNT_IN_RAW_MAX)) {
      throw new Error(`Amount is greater than ${INTERNAL_AMOUNT_IN_RAW_MAX}!`);
    }
    if (!internalAmountInRaw.modulo(1).isZero()) {
      throw new Error("Amount % 1 != 0!");
    }
    return internalAmountInRaw;
  }

  plus(amount: Amount | number | string): Amount {
    const result = this.value.plus(amount instanceof Amount ? amount.getInternalValue() : new InternalAmount(amount));
    if (result.isGreaterThan(INTERNAL_AMOUNT_IN_RAW_MAX)) {
      throw new Error(`Resulting amount may not be greater than ${INTERNAL_AMOUNT_IN_RAW_MAX}!`);
    }
    return new Amount(result);
  }

  minus(amount: Amount | number | string): Amount {
    const result = this.value.minus(amount instanceof Amount ? amount.getInternalValue() : new InternalAmount(amount));
    if (result.isLessThan(INTERNAL_AMOUNT_IN_RAW_MIN)) {
      throw new Error(`Resulting amount may not be less than ${INTERNAL_AMOUNT_IN_RAW_MIN}!`);
    }
    return new Amount(result);
  }

  times(n: Amount | number | string): Amount {
    const result = this.value.times(n instanceof Amount ? n.getInternalValue() : new InternalAmount(n));
    if (result.isLessThan(INTERNAL_AMOUNT_IN_RAW_MIN)) {
      throw new Error(`Resulting amount may not be less than ${INTERNAL_AMOUNT_IN_RAW_MIN}!`);
    }
    if (result.isGreaterThan(INTERNAL_AMOUNT_IN_RAW_MAX)) {
      throw new Error(`Resulting amount may not be greater than ${INTERNAL_AMOUNT_IN_RAW_MAX}!`);
    }
    return new Amount(result);
  }

  dividedBy(n: Amount | number | string): Amount {
    const result = this.value.dividedBy(n instanceof Amount ? n.getInternalValue() : new InternalAmount(n));
    if (result.isLessThan(INTERNAL_AMOUNT_IN_RAW_MIN)) {
      throw new Error(`Resulting amount may not be less than ${INTERNAL_AMOUNT_IN_RAW_MIN}!`);
    }
    if (result.isGreaterThan(INTERNAL_AMOUNT_IN_RAW_MAX)) {
      throw new Error(`Resulting amount may not be greater than ${INTERNAL_AMOUNT_IN_RAW_MAX}!`);
    }
    return new Amount(result);
  }

  isGreaterThan(amount: Amount | number | string): boolean {
    return this.value.isGreaterThan(amount instanceof Amount ? amount.getInternalValue() : new InternalAmount(amount));
  }

  isGreaterThanOrEqualTo(amount: Amount | number | string): boolean {
    return this.value.isGreaterThanOrEqualTo(
      amount instanceof Amount ? amount.getInternalValue() : new InternalAmount(amount)
    );
  }

  isLessThan(amount: Amount | number | string): boolean {
    return this.value.isLessThan(amount instanceof Amount ? amount.getInternalValue() : new InternalAmount(amount));
  }

  isLessThanOrEqualTo(amount: Amount | number | string): boolean {
    return this.value.isLessThanOrEqualTo(
      amount instanceof Amount ? amount.getInternalValue() : new InternalAmount(amount)
    );
  }

  isEqualTo(amount: Amount | number | string): boolean {
    return this.value.isEqualTo(amount instanceof Amount ? amount.getInternalValue() : new InternalAmount(amount));
  }

  isZero(): boolean {
    return this.value.isZero();
  }

  isFinite(): boolean {
    return this.value.isFinite();
  }

  isNaN(): boolean {
    return this.value.isNaN();
  }

  static min(): Amount {
    return this.minAmount;
  }

  static max(): Amount {
    return this.maxAmount;
  }

  static zero(): Amount {
    return this.zeroAmount;
  }

  getInternalValue(): BigNumber {
    return this.value;
  }

  toNumber(unit: AmountUnit): number {
    return unit === AmountUnit.Nano ? this.value.shiftedBy(-30).toNumber() : this.value.toNumber();
  }

  toFormat(unit: AmountUnit = AmountUnit.Raw, decimalPlaces?: number): string {
    return unit === AmountUnit.Nano ? this.value.shiftedBy(-30).toFormat(decimalPlaces) : this.value.toFormat(0);
  }

  toString(unit: AmountUnit = AmountUnit.Raw, decimalPlaces = 30): string {
    return unit === AmountUnit.Nano ? this.value.shiftedBy(-30).toFixed(decimalPlaces) : this.value.toFixed(0);
  }
}
