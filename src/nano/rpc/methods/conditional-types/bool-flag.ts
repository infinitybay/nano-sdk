export type BoolFlag<T> = T extends true ? true : T extends false ? false : true | false;
