import { variables } from "./variables";
import { ContextValues } from "../types";
import { strings } from "./types/strings";
import { arrays } from "./types/arrays";
import { io } from "./io";

export const allDefaults: ContextValues = {
    ...variables,
    ...strings,
    ...arrays,
    ...io,
};
