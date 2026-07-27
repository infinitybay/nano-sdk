import { PostError } from "../../../../../src/nano/rpc/http/post-error";

describe("PostError class", () => {
  test("preserves response metadata and the original cause", () => {
    const cause = new Error("Original failure");
    const error = new PostError("Request failed.", {
      status: 500,
      statusText: "Internal Server Error",
      cause,
    });

    expect(error).toMatchObject({
      name: "PostError",
      message: "Request failed.",
      status: 500,
      statusText: "Internal Server Error",
      cause,
    });
  });
});
