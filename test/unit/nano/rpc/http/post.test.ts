import { z } from "zod";

import { HttpClient } from "../../../../../src/nano/rpc/http/http-client";
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

  test("forwards request headers and existing transport options to a custom HTTP client", async () => {
    const abortController = new AbortController();
    const headers = {
      Authorization: "Bearer token",
      "X-Custom-Header": "custom-value",
    };
    const httpClientPost = jest.fn(async () => ({ success: true, data: {} }) as const);
    const httpClient: HttpClient = { post: httpClientPost };

    await post("http://localhost", {}, z.object({}), z.object({}), {
      abortSignal: abortController.signal,
      headers,
      httpClient,
      timeoutInMs: 2000,
      throwOnError: true,
    });

    expect(httpClientPost).toHaveBeenCalledWith(
      "http://localhost",
      {},
      expect.objectContaining({
        abortSignal: abortController.signal,
        headers,
        timeoutInMs: 2000,
        throwOnError: true,
      })
    );
  });
});
