import { Run } from "./Run";
import { AST, Tag, Value } from "../ast";
import { ScriptError } from "../util/ScriptError";
import {
    ContextFn,
    ContextFnContext,
    ContextFunctionValidation,
} from "../context/types";
import { humanizeContextValidationParam } from "../context/util";

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

    /**
     * Process and execute a tag
     * @param tag The tag to execute
     */
    async process(tag: Tag) {
        if (!tag.params) {
            return this.getVariable(tag.reference, false, tag.referenceLoc);
        } else {
            const fn = this.getFunction(tag.reference, tag.referenceLoc);
            const params: any[] = [];
            const validationParams: [Value, any][] = [];

            for (const param of tag.params) {
                if (param && param.type === "Value") {
                    const converted = await this.astValueToValue(param);
                    params.push(converted);
                    validationParams.push([param, converted]);
                }
            }

            return fn(
                {
                    process: this,
                    tag,
                    validate: this.getValidationFunction(validationParams, tag),
                },
                ...params,
            );
        }
    }

    /**
     * Gets the literal value from an AST value
     * @param value The AST value to convert
     */
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

    /**
     * Finds the location of the value in the string being currently processed
     * @param value The value to find
     */
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

    /**
     * Creates the {@link ContextFnContext.validate} function from a tag and params resolved
     * @param foundParams Array of ast values and literal values
     * @param tag The tag in reference
     */
    getValidationFunction(
        foundParams: [Value, any][],
        tag: Tag,
    ): ContextFnContext["validate"] {
        return (validation, allowInvalid = false) => {
            const foundInvalid = (
                invalid: [Value, any] | undefined,
                v: ContextFunctionValidation,
                optional: boolean,
                customMessage?: string,
            ) => {
                if (!allowInvalid) {
                    throw new ScriptError(
                        customMessage ??
                            `Expected${
                                optional ? " (optional)" : ""
                            } type ${humanizeContextValidationParam(v)} but ${
                                invalid
                                    ? `got ${invalid[1]}`
                                    : `nothing was passed`
                            }`,
                        invalid
                            ? this.findValueLocation(invalid[0])
                            : tag.referenceLoc,
                        this.processingRaw,
                    );
                }
                return false;
            };

            for (let i = 0; i < validation.length; i++) {
                const v = validation[i];
                const rawparam = foundParams[i];
                let optional = false;

                if (typeof v !== "string" && "optional" in v) {
                    if (typeof v.optional === "string") optional = true;
                    else optional = !!v.optional;
                }

                if (v && !optional && !rawparam)
                    return foundInvalid(
                        undefined,
                        v,
                        optional,
                        `Param at index ${i} of type ${humanizeContextValidationParam(
                            v,
                        )} is not optional`,
                    );

                const [value, param] = rawparam;

                if (typeof v === "string") {
                    if (v !== "any" && typeof param !== v)
                        return foundInvalid([value, param], v, optional);
                } else if ("optional" in v) {
                    if (
                        typeof v.optional === "string" &&
                        v.optional !== "any" &&
                        typeof param !== v.optional
                    )
                        return foundInvalid([value, param], v, optional);
                } else if ("array" in v) {
                    if (!Array.isArray(param))
                        return foundInvalid(
                            [value, param],
                            v,
                            optional,
                            `Expected array of type ${humanizeContextValidationParam(
                                v,
                            )} but instead got ${param}`,
                        );

                    const hasInvalid =
                        v.array === "any"
                            ? false
                            : param.some((p) => typeof p !== v.array);

                    if (hasInvalid)
                        return foundInvalid([value, param], v, optional);
                } else if ("union" in v) {
                    if (v.union.includes("any")) continue;
                    if (v.arrayOf) {
                        if (!Array.isArray(param))
                            return foundInvalid([value, param], v, optional);
                        const hasInvalid = param.some(
                            (p) => !v.union.includes(typeof p),
                        );
                        if (hasInvalid)
                            return foundInvalid([value, param], v, optional);
                    } else if (
                        Array.isArray(param) ||
                        !v.union.includes(typeof param)
                    )
                        return foundInvalid([value, param], v, optional);
                } else if ("tuple" in v) {
                    if (!Array.isArray(param))
                        return foundInvalid([value, param], v, optional);

                    for (let ei = 0; ei < v.tuple.length; ei++) {
                        const expected = v.tuple[ei];
                        if (expected === "any") continue;
                        if (!param[ei])
                            return foundInvalid(
                                [value, param],
                                v,
                                optional,
                                `Expected value at index ${ei} of tuple ${humanizeContextValidationParam(
                                    v,
                                )} but got nothing`,
                            );
                        else if (typeof param[ei] !== expected)
                            return foundInvalid(
                                [value, param],
                                v,
                                optional,
                                `Expected value of type ${humanizeContextValidationParam(
                                    expected,
                                )} at index ${ei} of tuple ${humanizeContextValidationParam(
                                    v,
                                )} but got ${param[ei]}`,
                            );
                    }
                }
            }

            return true;
        };
    }

    /**
     * Get a function from the context or process
     * @param name The name of the function
     * @param token The token that initiated this fetch
     */
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

    /**
     * Get a variable from the context or process
     * @param name Variable name
     * @param nullable If it is nullable, if false will throw an error
     * @param token The token that initiated the fetch
     */
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
