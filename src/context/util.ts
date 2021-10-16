import { ContextFunctionValidation, ContextValues, DeepContext } from "./types";

/**
 * Flattens a context where values may sit in recursive objects into a single object where values are always a context value or function
 * @param deep The value to flatten
 */
export function flattenDeepRecursiveContext(deep: DeepContext): ContextValues {
    const context: ContextValues = {};

    for (const key of Object.keys(deep)) {
        const v = deep[key];
        if (
            typeof v !== "string" &&
            typeof v !== "number" &&
            typeof v !== "boolean" &&
            typeof v !== "function"
        ) {
            const deeper = flattenDeepRecursiveContext(v);

            for (const deeperkey of Object.keys(deeper)) {
                context[`${key}.${deeperkey}`] = deeper[deeperkey];
            }
        } else context[key] = v;
    }

    return context;
}

/**
 * The same as {@link flattenDeepRecursiveContext} except the passed value must be an object of keys whos values are a context values object.
 * @param deep The value to flatten
 */
export function flattenDeepSimpleContext(
    deep: Record<string, ContextValues>,
): ContextValues {
    const context: any = {};

    for (const rootkey of Object.keys(deep)) {
        const rootval = deep[rootkey];
        for (const subkey of Object.keys(rootval)) {
            context[`${rootkey}.${subkey}`] = rootval[subkey];
        }
    }

    return context;
}

/**
 * Turns a validation param into a human readable string
 * @param param
 */
export function humanizeContextValidationParam(
    param: ContextFunctionValidation,
): string {
    if (typeof param === "string") return param;
    else if ("array" in param)
        return `${humanizeContextValidationParam(param.array)}[]`;
    else if ("union" in param)
        return `${param.union
            .map((u) => humanizeContextValidationParam(u))
            .join(" | ")}`;
    else if ("tuple" in param)
        return `[ ${param.tuple
            .map((t) => humanizeContextValidationParam(t))
            .join(", ")} ]`;
    else return `${param.optional}?`;
}
