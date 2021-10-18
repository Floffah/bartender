import { ContextValues } from "./types";

/**
 * A class used to provide functions and global variables to runtimes and runs.
 */
export class Context {
    private contextValues: ContextValues = {};

    /**
     * Quickly create a new context object that extends a base/parent context.
     * @param parent The parent context object or context values to extend from.
     */
    static extend(parent: Context | ContextValues) {
        const context = new Context();
        context.contextValues =
            parent instanceof Context ? parent.contextValues : parent;
        return context;
    }

    /**
     * Add variables/functions to the context.
     * @param values A record of variables/functions.
     */
    addValues(values: ContextValues) {
        this.contextValues = Object.assign(this.contextValues, values);
        return this;
    }

    /**
     * Get a specific context variable or function.
     * @param name The name of the context value.
     */
    getValue(name: keyof ContextValues): ContextValues[any] | undefined {
        if (!(name in this.contextValues)) return undefined; // might as well tbh
        return this.contextValues[name];
    }

    /**
     * Remove certain named values from the context.
     * @param names The names to remove.
     */
    removeValues(...names: (keyof ContextValues)[]) {
        const copy = { ...this.contextValues };

        for (const name of names) {
            delete copy[name];
        }

        this.contextValues = copy;
        return this;
    }
}
