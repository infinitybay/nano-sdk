export type BooleanOption<T, TrueCase, FalseCase> = T extends true ? TrueCase : FalseCase;
