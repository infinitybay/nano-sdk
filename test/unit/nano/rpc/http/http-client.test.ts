import { defaultHttpClient } from "../../../../../src/nano/rpc/http/http-client";

describe("defaultHttpClient", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  function mockSuccessfulFetch() {
    return jest.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ balance: "1", pending: "0" }), {
        headers: { "Content-Type": "application/json" },
        status: 200,
        statusText: "OK",
      })
    );
  }

  test("uses the default JSON content type without custom headers", async () => {
    const fetchMock = mockSuccessfulFetch();

    await defaultHttpClient.post("http://localhost", {});

    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost",
      expect.objectContaining({ headers: { "Content-Type": "application/json" } })
    );
  });

  test("forwards an Authorization header and merges it with the default content type", async () => {
    const fetchMock = mockSuccessfulFetch();

    await defaultHttpClient.post("http://localhost", {}, { headers: { Authorization: "Bearer token" } });

    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost",
      expect.objectContaining({
        headers: {
          Authorization: "Bearer token",
          "Content-Type": "application/json",
        },
      })
    );
  });

  test("forwards multiple arbitrary custom headers", async () => {
    const fetchMock = mockSuccessfulFetch();

    await defaultHttpClient.post(
      "http://localhost",
      {},
      {
        headers: {
          "X-Custom-Header": "custom-value",
          "X-Request-ID": "request-id",
        },
      }
    );

    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost",
      expect.objectContaining({
        headers: {
          "Content-Type": "application/json",
          "X-Custom-Header": "custom-value",
          "X-Request-ID": "request-id",
        },
      })
    );
  });

  test("allows a custom content type to override the default", async () => {
    const fetchMock = mockSuccessfulFetch();

    await defaultHttpClient.post("http://localhost", {}, { headers: { "Content-Type": "application/json-rpc" } });

    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost",
      expect.objectContaining({ headers: { "Content-Type": "application/json-rpc" } })
    );
  });

  test("does not mutate the caller-provided headers object", async () => {
    const fetchMock = mockSuccessfulFetch();
    const headers = { Authorization: "Bearer token" };

    await defaultHttpClient.post("http://localhost", {}, { headers });

    expect(headers).toEqual({ Authorization: "Bearer token" });
    expect(fetchMock.mock.calls[0][1]?.headers).not.toBe(headers);
  });

  test("continues to forward an abort signal", async () => {
    const fetchMock = mockSuccessfulFetch();
    const abortController = new AbortController();

    await defaultHttpClient.post("http://localhost", {}, { abortSignal: abortController.signal });

    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost",
      expect.objectContaining({ signal: abortController.signal })
    );
  });

  test("continues to create a timeout abort signal", async () => {
    const fetchMock = mockSuccessfulFetch();

    await defaultHttpClient.post("http://localhost", {}, { timeoutInMs: 2000 });

    const requestConfig = fetchMock.mock.calls[0][1];
    expect(requestConfig?.signal).toBeInstanceOf(AbortSignal);
  });

  test("continues to return transport errors", async () => {
    jest.spyOn(globalThis, "fetch").mockRejectedValue(new Error("Network failure"));

    await expect(defaultHttpClient.post("http://localhost", {})).resolves.toEqual({
      success: false,
      error: { message: "Network failure" },
    });
  });
});
