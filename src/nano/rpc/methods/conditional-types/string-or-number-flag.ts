export type StringOrNumberFlag<T> = [T] extends undefined
  ? false
  : T extends number
    ? true
    : T extends string
      ? true
      : false;
