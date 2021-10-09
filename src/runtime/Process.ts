import { Run } from "src";
import { AST } from "src/ast";

export class Process {
    run: Run;

    static async execute(ast: AST, run: Run) {
        const proc = new Process();
        proc.run = run;
        return await proc.execute(ast);
    }

    async execute(_ast: AST) {
        // todo
    }
}
