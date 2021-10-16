import { flattenDeepSimpleContext } from "../../util";
import { ContextValues } from "../../types";

export const arrays: ContextValues = {
    index: (ctx, index: number, array: any[]) => {
        ctx.validate(["number", { array: "any" }]);
        return array[index];
    },
    ...flattenDeepSimpleContext({
        array: {
            join: (ctx, array: any[], joiner = " ") => {
                ctx.validate([{ array: "any" }, { optional: "string" }]);
                return array.join(joiner);
            },
        },
    }),
};
