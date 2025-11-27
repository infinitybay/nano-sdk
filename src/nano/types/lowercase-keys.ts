export type LowercaseKeys<T extends Record<string, unknown>> = {
  [K in keyof T as K extends string ? Lowercase<K> : K]: T[K];
};
