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
    /**
     * Object type
     */
    type: "LiteralReferenceValue";
    /**
     * The referenced value as a lexer token
     */
    value: Token;
}

/**
 * A value that represents a literal number.
 */
export interface NumberValue {
    /**
     * Object type
     */
    type: "NumberValue";
    /**
     * The number value as a lexer token array (because sometimes the parser parses decimals as multiple tokens)
     */
    value: Token[];
}

/**
 * A value that represents a literal string.
 */
export interface StringValue {
    /**
     * Object type
     */
    type: "StringValue";
    /**
     * The string value as a lexer token
     */
    value: Token;
}

/**
 * A value that represents a mathematical operation or concatenation operation.
 */
export interface Operation {
    /**
     * Object type
     */
    type:
        | "AdditionOperation"
        | "SubtractionOperation"
        | "DivisionOperation"
        | "MultiplicationOperation";
    /**
     * The left side of the operation
     */
    left: Value;
    /**
     * The right side of the operation
     */
    right: Value;
}
