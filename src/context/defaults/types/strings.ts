import { flattenDeepSimpleContext } from "../../util";

export const strings = flattenDeepSimpleContext({
    string: {
        split: (ctx, string: string, splitter: string) => {
            ctx.validate(["string", "string"]);
            return string.split(splitter);
        },
        lower: (ctx, string: string) => {
            ctx.validate(["string"]);
            return string.toLowerCase();
        },
        upper: (ctx, string: string) => {
            ctx.validate(["string"]);
            return string.toUpperCase();
        }
    },
});
