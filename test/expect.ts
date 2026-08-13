export function expectErrorCode(error: unknown, expectedCode: string): void {
  expect(error).toBeInstanceOf(Error);
  expect(error).toMatchObject({ code: expectedCode });
}

export function expectToThrowErrorCode(action: () => unknown, expectedCode: string): void {
  let thrownError: unknown;

  try {
    action();
  } catch (error) {
    thrownError = error;
  }

  expectErrorCode(thrownError, expectedCode);
}
