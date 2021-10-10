import { Token } from "moo";
import { Tag } from ".";

/**
 * A type that represents all types of values.
 */
export type Value = LiteralReferenceValue | NumberValue | Operation | Tag;

/**
 * A value that represents a literal reference to a context or runtime variable.
 */
export interface LiteralReferenceValue {
    type: "LiteralReferenceValue";
    value: Token;
}

/**
 * A value that represents a literal number.
 */
export interface NumberValue {
    type: "NumberValue";
    value: Token[];
}

/**
 * A value that represents a literal string.
 */
export interface StringValue {
    type: "StringValue";
    value: string;
}

/**
 * A value that represents a mathematical operation or concatenation operation.
 */
export interface Operation {
    type:
        | "AdditionOperation"
        | "SubtractionOperation"
        | "DivisionOperation"
        | "MultiplicationOperation";
    left: Value;
    right: Value;
}
