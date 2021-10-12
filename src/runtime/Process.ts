import { Run } from "./Run";
import { AST, Tag, Value } from "../ast";
import { ContextFn } from "../context/Context";
import { ScriptError } from "../util/ScriptError";

/**
 * Class used by {@see Run} to run parsed code and get the output text.
 */
export class Process {
    run: Run;

    processing: AST;
    processingRaw: string;

    variables: Record<string, any> = {};
    functions: Record<string, ContextFn> = {};

    /**
     * Helper method for running any parsed {@link AST} using a {@link Run} for its context.
     * @param ast The {@link AST} to process
     * @param raw The raw text that is being process. This is used to form errors with helpful messages.
     * @param run The {@link Run} whose context to use
     * @returns string The text output from {@link Process#execute}
     */
    static async execute(ast: AST, raw: string, run: Run) {
        const proc = new Process();
        proc.run = run;
        return await proc.execute(ast, raw);
    }

    /**
     * Execute any parsed {@link AST}
     * @param ast The {@link AST} to process
     * @param raw The raw text that is being process. This is used to form errors with helpful messages.
     * @returns string The outputted text gathered from executing the parsed AST
     */
    async execute(ast: AST, raw: string) {
        this.processing = ast;
        this.processingRaw = raw;
        let finalText = "";

        for (const part of ast) {
            if (part && part.type === "Main") {
                for (const mainpart of part.body) {
                    if (!mainpart) continue;
                    if (mainpart.type === "Plaintext") {
                        finalText += mainpart.value.value;
                    } else if (mainpart.type === "Tag") {
                        finalText += await this.process(mainpart);
                    }
                }
            }
        }

        return finalText;
    }

    async process(tag: Tag) {
        if (!tag.params) {
            return this.getVariable(tag.reference, false, tag.referenceLoc);
        } else {
            const fn = this.getFunction(tag.reference, tag.referenceLoc);
            const params: any[] = [];

            for (const param of tag.params) {
                if (param && param.type === "Value")
                    params.push(await this.astValueToValue(param));
            }

            return fn(this, tag, ...params);
        }
    }

    async astValueToValue(value: Value) {
        if (value.value.type === "NumberValue")
            return parseInt(value.value.value.map((v) => v.value).join(""));
        else if (value.value.type === "LiteralReferenceValue") {
            const name = value.value.name.value;
            const found =
                this.variables[name] ??
                this.run.context.getValue(name) ??
                this.functions[name];
            if (!found)
                throw new ScriptError(
                    `Could not find referencable value ${name}`,
                    value.value.name,
                    this.processingRaw,
                );
            return found;
        } else if (value.value.type === "Operation") {
            const left: any = await this.astValueToValue(value.value.left);
            const right: any = await this.astValueToValue(value.value.right);

            if (value.value.operationType === "AdditionOperation")
                return left + right;
            else {
                if (typeof left !== "number")
                    throw new ScriptError(
                        `${left} is not a number`,
                        this.findValueLocation(value.value.left),
                        this.processingRaw,
                    );
                else if (typeof right !== "number")
                    throw new ScriptError(
                        `${right} is not a number`,
                        this.findValueLocation(value.value.right),
                        this.processingRaw,
                    );

                if (value.value.operationType === "DivisionOperation")
                    return left / right;
                else if (
                    value.value.operationType === "MultiplicationOperation"
                )
                    return left * right;
                else return left - right;
            }
        } else if (value.value.type === "Tag") {
            return await this.process(value.value);
        } else return value.value.value.value;
    }

    findValueLocation(value: Value): { col: number; line: number } {
        if (value.value.type === "Operation")
            return this.findValueLocation(value.value.left);
        else if (value.value.type === "Tag") return value.value.referenceLoc;
        else if (value.value.type === "LiteralReferenceValue")
            return value.value.name;
        else {
            const val = value.value.value;
            if (Array.isArray(val)) return val[0];
            else return val;
        }
    }

    getFunction(
        name: string,
        token?: typeof ScriptError.prototype.token,
    ): ContextFn {
        let ref = this.functions[name];
        if (!ref) {
            const ctxval = this.run.context.getValue(name);
            if (!ctxval || typeof ctxval !== "function") {
                const errmsg = `${name} could not be resolved to a function`;
                throw token
                    ? new ScriptError(errmsg, token, this.processingRaw)
                    : new Error(errmsg);
            }
            ref = ctxval;
        }
        return ref;
    }

    getVariable(
        name: string,
        nullable = false,
        token?: typeof ScriptError.prototype.token,
    ) {
        const ref = this.variables[name] ?? this.run.context.getValue(name);
        if (!nullable && (typeof ref === "undefined" || ref === null)) {
            // may be NaN
            const errmsg = `${name} could not be resolved is not nullable`;
            throw token
                ? new ScriptError(errmsg, token, this.processingRaw)
                : new Error(errmsg);
        }
        return ref;
    }
}
