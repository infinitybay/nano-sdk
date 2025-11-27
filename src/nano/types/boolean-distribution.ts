export type BooleanDistribution<T, TrueCase, FalseCase> = T extends true
  ? TrueCase
  : T extends false
    ? FalseCase
    : TrueCase | FalseCase;
