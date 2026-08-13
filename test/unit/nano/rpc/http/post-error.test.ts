import { PostError } from "../../../../../src/nano/rpc/http/post-error";
import { PostErrorCode } from "../../../../../src/nano/rpc/http/post-error-code";
import { expectErrorCode } from "../../../../expect";

describe("PostError class", () => {
  test("preserves response metadata and the original cause", () => {
    const cause = new Error("Original failure");
    const error = new PostError(PostErrorCode.HttpError, "Request failed.", {
      status: 500,
      statusText: "Internal Server Error",
      cause,
    });

    expectErrorCode(error, PostErrorCode.HttpError);
    expect(error).toMatchObject({
      name: "PostError",
      status: 500,
      statusText: "Internal Server Error",
      cause,
    });
  });
});
