export type ThresholdFlag<T> = [T] extends ["" | "0" | undefined]
  ? false
  : T extends string
    ? [string] extends [T]
      ? boolean
      : true
    : false;
