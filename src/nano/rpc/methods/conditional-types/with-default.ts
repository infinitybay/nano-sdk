export type WithDefault<T extends object, Key extends PropertyKey, Default> = Key extends keyof T
  ? undefined extends T[Key]
    ? Omit<T, Key> & {
        [K in Key]: Default;
      }
    : T
  : T & {
      [K in Key]: Default;
    };
