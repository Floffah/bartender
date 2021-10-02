import { Context, ContextValues } from "src/context/Context";

/**
 * A "runtime" class that acts as a bridge between the context and runs, and a manager for runs.
 */
export class Runtime {
    private context: Context;

    /**
     * Instantiate a new runtime based on a certain context or context values.
     * @param context The context/values to assign.
     */
    static from(context: Context | ContextValues) {
        const runtime = new Runtime();
        runtime.context =
            context instanceof Context ? context : Context.extend(context);
        return runtime;
    }

    /**
     * Instantiate a new runtime with an empty context.
     */
    static base() {
        const runtime = new Runtime();
        runtime.context = new Context();
        return runtime;
    }

    /**
     * A function used to modify a context after it has already been assigned to a runtime.
     * @param fn Function to modify the context. Must return the same context.
     */
    modify(fn: (c: Context) => Context) {
        this.context = fn(this.context ?? new Context());
    }
}
