import { Context } from "src/context/Context";
import { Runtime } from "src/runtime/Runtime";
import { Parser } from "nearley";
import { AST } from "src/ast";
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

    async start(code: string) {
        let parser: Parser;

        if (this.runtime.opts?.shareParser) {
            parser = this.runtime.commonParser as Parser;
        } else {
            parser = new Parser(this.runtime.grammar);
        }

        parser.feed(code);
        this.parserOutput = parser.finish() as AST;

        return Process.execute(this.parserOutput, this);
    }
}
