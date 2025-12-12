export type StringFlag<T> = [T] extends undefined ? false : T extends string ? true : false;
