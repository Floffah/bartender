import { Context, ContextValues } from "src/context/Context";
import { Run } from "src/runtime/Run";
import { Grammar, Parser } from "nearley";
import grammar from "src/lang/lang";

/**
 * Runtime options.
 */
export interface RuntimeOpts {
    /**
     * Whether each run should re-use the same parser stored in the runtime.
     * May have unintentional side-effects.
     */
    shareParser?: boolean;
}

/**
 * A "runtime" class that acts as a bridge between the context and runs, and a manager for runs.
 */
export class Runtime {
    private context: Context;
    opts?: RuntimeOpts;

    grammar = Grammar.fromCompiled(grammar);
    commonParser?: Parser;

    /**
     * Instantiate a new runtime based on a certain context or context values.
     * @param context The context/values to assign.
     * @param opts Optional runtime options.
     */
    static from(context: Context | ContextValues, opts?: RuntimeOpts) {
        const runtime = new Runtime(opts);
        runtime.context =
            context instanceof Context ? context : Context.extend(context);
        return runtime;
    }

    /**
     * Instantiate a new runtime with an empty context.
     * @param opts Optional runtime options.
     */
    static base(opts?: RuntimeOpts) {
        const runtime = new Runtime(opts);
        runtime.context = new Context();
        return runtime;
    }

    /**
     * Create a runtime.
     * @param opts Optional runtime options.
     */
    constructor(opts?: RuntimeOpts) {
        this.opts = opts;
        if (this.opts?.shareParser) {
            this.commonParser = new Parser(this.grammar);
        }
    }

    /**
     * A function used to modify a context after it has already been assigned to a runtime.
     * @param fn Function to modify the context. Must return the same context.
     */
    modify(fn: (c: Context) => Context) {
        this.context = fn(this.context ?? new Context());
    }

    async run(code: string) {
        const run = Run.from(this, this.context);

        await run.start(code);
    }
}
