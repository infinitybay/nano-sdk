import { z } from "zod";

const NANO_REGEX = /^(0|[1-9][0-9]*)(\.[0-9]{1,30})?$/;
const RAW_REGEX = /^(0|[1-9][0-9]*)$/;

const RAW_MIN_STRING = "0";
const RAW_MAX_STRING = "340282366920938463463374607431768211455";

export const RAW_SCALE = 10n ** 30n;
export const RAW_MIN = BigInt(RAW_MIN_STRING);
export const RAW_MAX = BigInt(RAW_MAX_STRING);

const NANO_MIN_STRING = "0";
const NANO_MAX_STRING = "340282366.920938463463374607431768211455";

function isValidNanoAmountString(value: string): boolean {
  try {
    if (!NANO_REGEX.test(value)) {
      return false;
    }

    const [integerPart, fractionPart = ""] = value.split(".");
    if (fractionPart.length > 30) {
      return false;
    }

    const rawValue = BigInt(integerPart + fractionPart.padEnd(30, "0"));
    if (rawValue < RAW_MIN) {
      return false;
    }

    if (rawValue > RAW_MAX) {
      return false;
    }

    return true;
  } catch (_err) {
    return false;
  }
}

function isValidRawAmountString(value: string): boolean {
  try {
    if (!RAW_REGEX.test(value)) {
      return false;
    }

    const rawValue = BigInt(value);
    if (rawValue < RAW_MIN) {
      return false;
    }

    if (rawValue > RAW_MAX) {
      return false;
    }

    return true;
  } catch (_err) {
    return false;
  }
}

export type NanoAmountString = z.infer<ReturnType<typeof NanoAmountString>>;
export const NanoAmountString = () =>
  z
    .string()
    .regex(NANO_REGEX)
    .refine((val) => isValidNanoAmountString(val), {
      message: "Invalid nano amount!",
    });

export const NanoAmountStrings = {
  min: (): NanoAmountString => NANO_MIN_STRING,
  max: (): NanoAmountString => NANO_MAX_STRING,
  zero: (): NanoAmountString => "0",
};

export type RawAmountString = z.infer<ReturnType<typeof RawAmountString>>;
export const RawAmountString = () =>
  z
    .string()
    .regex(RAW_REGEX)
    .refine((val) => isValidRawAmountString(val), {
      message: "Invalid raw amount!",
    });

export const RawAmountStrings = {
  min: (): RawAmountString => RAW_MIN_STRING,
  max: (): RawAmountString => RAW_MAX_STRING,
  zero: (): RawAmountString => "0",
};

export type RawAmount = z.infer<ReturnType<typeof RawAmount>>;
export const RawAmount = () =>
  z
    .union([
      // string input
      z
        .string()
        .regex(RAW_REGEX)
        .transform((v) => BigInt(v)),

      // number input
      z
        .number()
        .refine((v) => Number.isFinite(v) && Number.isInteger(v) && Number.isSafeInteger(v), {
          message: "Invalid raw amount!",
        })
        .transform((v) => BigInt(v)),

      // bigint input
      z.bigint(),
    ])
    .refine((v) => v >= RAW_MIN && v <= RAW_MAX, {
      message: "Invalid raw amount!",
    });

export const RawAmounts = {
  min: (): RawAmount => RAW_MIN,
  max: (): RawAmount => RAW_MAX,
  zero: (): RawAmount => 0n,
};
