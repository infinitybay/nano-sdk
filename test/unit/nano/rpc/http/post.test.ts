import z from "zod";

import { post } from "../../../../../src/nano/rpc/http/post";

describe("post function", () => {
  test("preserves a non-Error value thrown by a custom HTTP client", async () => {
    const cause = { code: "CUSTOM_CLIENT_FAILURE" };
    const httpClient = {
      async post() {
        throw cause;
      },
    };

    await expect(
      post("http://localhost", {}, z.object({}), z.object({}), { httpClient, throwOnError: true })
    ).rejects.toMatchObject({
      message:
        "An unknown error occurred. Please contact the library developer with details about your usage and environment.",
      cause,
    });
  });
});
