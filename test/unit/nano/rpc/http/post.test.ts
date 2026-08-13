import { z } from "zod";

import { HttpClient } from "../../../../../src/nano/rpc/http/http-client";
import { post } from "../../../../../src/nano/rpc/http/post";
import { PostErrorCode } from "../../../../../src/nano/rpc/http/post-error-code";
import { assert } from "../../../../assert";

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
      code: PostErrorCode.Unexpected,
      cause,
    });
  });

  test("returns an invalid-request code for request schema failures", async () => {
    const result = await post(
      "http://localhost",
      { value: "invalid" } as never,
      z.object({ value: z.number() }),
      z.object({}),
      { throwOnError: false }
    );

    assert(!result.success);
    expect(result.error.code).toBe(PostErrorCode.InvalidRequest);
  });

  test("returns a transport code for a custom HTTP client failure without a code", async () => {
    const httpClient: HttpClient = {
      async post() {
        return { success: false, error: { message: "transport failure" } };
      },
    };

    const result = await post("http://localhost", {}, z.object({}), z.object({}), {
      httpClient,
      throwOnError: false,
    });

    assert(!result.success);
    expect(result.error.code).toBe(PostErrorCode.TransportError);
  });

  test("returns a node-error code without interpreting the node message", async () => {
    const httpClient: HttpClient = {
      async post() {
        return { success: true, data: { error: "node-specific text" }, status: 200 };
      },
    };

    const result = await post("http://localhost", {}, z.object({}), z.object({}), {
      httpClient,
      throwOnError: false,
    });

    assert(!result.success);
    expect(result.error.code).toBe(PostErrorCode.NodeError);
    expect(result.status).toBe(200);
  });

  test("returns an invalid-response code for response schema failures", async () => {
    const httpClient: HttpClient = {
      async post() {
        return { success: true, data: { value: "invalid" } };
      },
    };

    const result = await post("http://localhost", {}, z.object({}), z.object({ value: z.number() }), {
      httpClient,
      throwOnError: false,
    });

    assert(!result.success);
    expect(result.error.code).toBe(PostErrorCode.InvalidResponse);
  });

  test("returns an HTTP-client code when a custom HTTP client throws an Error", async () => {
    const httpClient: HttpClient = {
      async post() {
        throw new Error("transport failure");
      },
    };

    const result = await post("http://localhost", {}, z.object({}), z.object({}), {
      httpClient,
      throwOnError: false,
    });

    assert(!result.success);
    expect(result.error.code).toBe(PostErrorCode.HttpClientError);
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
