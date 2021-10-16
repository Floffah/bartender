import { ContextValues } from "../../types";

export const variables: ContextValues = {
    /**
     * Set a variables value
     * @param name Variable name
     * @param val Variable value
     */
    set: (ctx, name: string, val: any) => {
        ctx.validate(["string", "any"]);
        ctx.process.variables[name] = val;
        return val;
    },
    /**
     * Get a variable
     * @param name Variable name
     */
    get: (ctx, name: string) => {
        ctx.validate(["string"]);
        return ctx.process.getVariable(name, false, ctx.tag.referenceLoc);
    },
};
