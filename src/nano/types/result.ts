type SuccessfulResult<T> = { success: true; data: T };
type FailedResult<TError extends Error> = { success: false; error: TError };

export type Result<T, TError extends Error = Error> = SuccessfulResult<T> | FailedResult<TError>;

function ok<T>(data: T): Result<T, never> {
  return { success: true, data };
}

function err<TError extends Error>(error: TError): Result<never, TError> {
  return { success: false, error };
}

function unwrap<T, TError extends Error>(result: Result<T, TError>, throwOnError: false): Result<T, TError>;
function unwrap<T, TError extends Error>(result: Result<T, TError>, throwOnError?: true): T;
function unwrap<T, TError extends Error>(result: Result<T, TError>, throwOnError?: boolean): T | Result<T, TError>;
function unwrap<TSuccess extends SuccessfulResult<unknown>, TFailure extends FailedResult<Error>>(
  result: TSuccess | TFailure,
  throwOnError: false
): TSuccess | TFailure;
function unwrap<TSuccess extends SuccessfulResult<unknown>, TFailure extends FailedResult<Error>>(
  result: TSuccess | TFailure,
  throwOnError?: true
): TSuccess["data"];
function unwrap<TSuccess extends SuccessfulResult<unknown>, TFailure extends FailedResult<Error>>(
  result: TSuccess | TFailure,
  throwOnError?: boolean
): TSuccess["data"] | TSuccess | TFailure;
function unwrap(result: Result<unknown, Error>, throwOnError?: boolean): unknown {
  if (throwOnError === false) {
    return result;
  }

  if (result.success) {
    return result.data;
  }

  throw result.error;
}

export const Result = { err, ok, unwrap };

export type PredicateResult<StatusKey extends string, ValueKey extends string, TError extends Error = Error> =
  ({ [K in StatusKey]: true } & { [K in ValueKey]: boolean }) | ({ [K in StatusKey]: false } & { error: TError });
