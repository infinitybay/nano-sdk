import { z } from "zod";

import { HashString } from "./hash";
import { PublicKeyString } from "./public-key";

export type LinkString = z.infer<ReturnType<typeof LinkString>>;
export const LinkString = () => HashString().or(PublicKeyString());
