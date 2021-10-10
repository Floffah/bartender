import { Run } from "src";
import { AST } from "src/ast";

export class Process {
    run: Run;

    static async execute(ast: AST, run: Run) {
        const proc = new Process();
        proc.run = run;
        return await proc.execute(ast);
    }

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
