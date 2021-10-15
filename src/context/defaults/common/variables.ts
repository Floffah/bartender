import { ContextValues } from "../../types";

export const variables: ContextValues = {
    set: (ctx, name: string, val: any) => {
        ctx.validate(["string", "any"]);
        ctx.process.variables[name] = val;
        return val;
    },
    get: (ctx, name: string) => {
        ctx.validate(["string"]);
        return ctx.process.getVariable(name, false, ctx.tag.referenceLoc);
    },
};
