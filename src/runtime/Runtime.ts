import { Grammar, Parser } from "nearley";
import grammar from "../lang/lang";
import { Context } from "../context/Context";
import { Run } from "./Run";
import { ContextValues } from "../context/types";

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
    context: Context;
    opts?: RuntimeOpts;

    grammar = Grammar.fromCompiled(grammar);
    commonParser?: Parser;

    /**
     * Instantiate a new runtime based on a certain context.
     * @param context The context to assign.
     * @param opts Optional runtime options.
     */
    static from(context: Context, opts?: RuntimeOpts): Runtime;

    /**
     * Instantiate a new runtime based on certain context values.
     * @param context The values to assign.
     * @param opts Optional runtime options.
     */
    static from(context: ContextValues, opts?: RuntimeOpts): Runtime;

    // these are separated to fix typing errors

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
     * Run a snippet of code and get the text output.
     * @param code The code to run.
     */
    async run(code: string) {
        const run = Run.from(this, this.context);

        return await run.start(code);
    }
}
