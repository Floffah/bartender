export class Context {
    private contextValues: Record<
        string,
        string | number | boolean | ((...args: any[]) => any)
    > = {};

    /**
     * Quickly create a new context object that extends a base/parent context.
     * @param parent The parent context object or context values to extend from
     */
    static extend(parent: Context | typeof Context.prototype.contextValues) {
        const context = new Context();
        context.contextValues =
            parent instanceof Context ? parent.contextValues : parent;
        return context;
    }

    /**
     * Add variables/functions to the context.
     * @param values A record of variables/functions
     */
    addValues(values: typeof Context.prototype.contextValues) {
        this.contextValues = Object.assign(this.contextValues, values);
    }

    /**
     * Get a specific context variable or function
     * @param name The name of the context value
     */
    getValue(
        name: keyof typeof Context.prototype.contextValues,
    ): typeof Context.prototype.contextValues[any] | undefined {
        if (!(name in this.contextValues)) return undefined; // might as well tbh
        return this.contextValues[name];
    }
}
