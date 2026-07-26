export type Result<T> = { success: true; data: T } | { success: false; error: Error };

export type PredicateResult<StatusKey extends string, ValueKey extends string> =
  ({ [K in StatusKey]: true } & { [K in ValueKey]: boolean }) | ({ [K in StatusKey]: false } & { error: Error });
