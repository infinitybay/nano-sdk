export type UppercaseKeys<T extends Record<string, unknown>> = {
  [K in keyof T as K extends string ? Uppercase<K> : K]: T[K];
};
