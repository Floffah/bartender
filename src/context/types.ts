import { Process } from "../runtime/Process";
import { Tag } from "../ast";

/**
 * A type alias for context values.
 */
export type ContextValues = Record<
    string,
    string | number | boolean | ContextFn
>;

/**
 * Context controls and information that are passed to a context function.
 */
export interface ContextFnContext {
    /**
     * The process currently processing the run.
     */
    process: Process;
    /**
     * The raw AST tag that initiated the call to this context function.
     */
    tag: Tag;
    /**
     * Allows a function to validate its parameters and throw an error if they are invalid or continue and return a boolean.
     * @param validation The array of parameter types.
     * @param allowInvalid When true, if the parameters are wrong no error will be thrown but this function will return false.
     * @return boolean If allowInvalid is set to true and the parameters are invalid this will be false instead of true.
     */
    validate: (
        validation: ContextFunctionValidation[],
        allowInvalid?: boolean,
    ) => boolean;
}

/**
 * A type alias for context function validation types.
 */
export type ContextFunctionValidationTypes =
    | "string"
    | "boolean"
    | "number"
    | "bigint"
    | "function"
    | "symbol"
    | "undefined"
    | "null"
    | "object"
    | "any";

/**
 * A type alias for context function validation.
 */
export type ContextFunctionValidation =
    | ContextFunctionValidationTypes
    | { optional: ContextFunctionValidationTypes }
    | { array: ContextFunctionValidationTypes; optional?: boolean }
    | {
          union: ContextFunctionValidationTypes[];
          optional?: boolean;
          arrayOf?: boolean;
      }
    | { tuple: ContextFunctionValidationTypes[]; optional?: boolean };
/**
 * A type alias for a context function
 */
export type ContextFn = (context: ContextFnContext, ...args: any[]) => any;

/**
 * A type alias for a deep context object ready to be flattened.
 */
export type DeepContext = { [k: string]: ContextValues[string] | DeepContext };
