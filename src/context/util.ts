import { ContextFunctionValidation, ContextValues, DeepContext } from "./types";

export function flattenDeepContext(deep: DeepContext): ContextValues {
    const context: ContextValues = {};

    for (const key of Object.keys(deep)) {
        const v = deep[key];
        if (
            typeof v !== "string" &&
            typeof v !== "number" &&
            typeof v !== "boolean" &&
            typeof v !== "function"
        ) {
            const deeper = flattenDeepContext(v);

            for (const deeperkey of Object.keys(deeper)) {
                context[`${key}.${deeperkey}`] = deeper[deeperkey];
            }
        } else context[key] = v;
    }

    return context;
}

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
