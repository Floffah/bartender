import { Context } from "../context/Context";
import { Runtime } from "./Runtime";
import { Parser } from "nearley";
import { AST } from "../ast";
import { Process } from "./Process";

/**
 * A class that manages when a bit of code being run.
 */
export class Run {
    context: Context;
    runtime: Runtime;

    parserOutput: AST;

    /**
     * Create a run from a runtime and a context.
     * @param runtime The runtime.
     * @param context The context.
     */
    static from(runtime: Runtime, context: Context) {
        const run = new Run();
        run.context = context;
        run.runtime = runtime;
        return run;
    }

    /**
     * Start the run using a snippet of code.
     * @param code The snipped of code the run should use.
     * @returns string The text output from {@link Process#execute}
     */
    async start(code: string) {
        let parser: Parser;

        if (this.runtime.opts?.shareParser) {
            parser = this.runtime.commonParser as Parser;
        } else {
            parser = new Parser(this.runtime.grammar);
        }

        parser.feed(code);
        this.parserOutput = parser.finish() as AST;

        return await Process.execute(this.parserOutput, code, this);
    }
}
