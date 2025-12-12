export type NotUndefinedFlag<T> = [T] extends undefined ? false : true;
