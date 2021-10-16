import { ContextValues } from "../../types";

export const io: ContextValues = {
    print: (_ctx, ...args: any[]) => {
        console.log(...args);
    },
    //...flattenDeepSimpleContext({}),
};
