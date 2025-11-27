import type { Response } from "../safe/post";

export async function unwrapRpcResult<T>(resultPromise: Promise<Response<T>>): Promise<T> {
  const result = await resultPromise;
  if (result.success) {
    return result.data;
  }
  throw { message: result.error.message, status: result.status, statusText: result.statusText };
}
