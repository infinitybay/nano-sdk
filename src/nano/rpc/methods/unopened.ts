import { postFunction } from "../http/post";
import { UnopenedRequest } from "../requests/unopened";
import { UnopenedResponse } from "../responses/unopened";

export const unopened = postFunction(UnopenedRequest(), UnopenedResponse());
