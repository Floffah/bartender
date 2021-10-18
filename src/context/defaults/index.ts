import { variables } from "./variables";
import { ContextValues } from "../types";
import { strings } from "./types/strings";
import { arrays } from "./types/arrays";
import { io } from "./io";
import { Context } from "../Context";

export const allDefaults: ContextValues = {
    ...variables,
    ...strings,
    ...arrays,
    ...io,
};

export const defaults = { variables, strings, arrays, io };

export const createFullContext = () => Context.extend(allDefaults);
export const createIsolatedContext = () =>
    Context.extend({ ...variables, ...strings, ...arrays });
export const createTypesOnlyContext = () =>
    Context.extend({ ...strings, ...arrays });
