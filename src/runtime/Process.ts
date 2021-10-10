import { Run } from "src";
import { AST } from "src/ast";

/**
 * Class used by {@see Run} to run parsed code and get the output text.
 */
export class Process {
    run: Run;

    /**
     * Helper method for running any parsed {@link AST} using a {@link Run} for its context.
     * @param ast The {@link AST} to process
     * @param run The {@link Run} whose context to use
     * @returns string The text output from {@link Process#execute}
     */
    static async execute(ast: AST, run: Run) {
        const proc = new Process();
        proc.run = run;
        return await proc.execute(ast);
    }

    /**
     * Execute any parsed {@link AST}
     * @param ast The {@link AST} to process
     * @returns string The outputted text gathered from executing the parsed AST
     */
    async execute(ast: AST) {
        let finalText = "";

        for (const part of ast) {
            if (part !== null && part.type === "Main") {
                for (const mainpart of part.body) {
                    if (mainpart !== null && mainpart.type === "Plaintext") {
                        finalText += mainpart.value.value;
                    }
                }
            }
        }

        return finalText;
    }
}
