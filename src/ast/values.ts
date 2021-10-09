import { Token } from "moo";
import { Tag } from ".";

export type Value = LiteralReferenceValue | NumberValue | Operation | Tag;

export interface LiteralReferenceValue {
    type: "LiteralReferenceValue";
    value: Token;
}

export interface NumberValue {
    type: "NumberValue";
    value: Token[];
}

export interface StringValue {
    type: "StringValue";
    value: string;
}

export interface Operation {
    type:
        | "AdditionOperation"
        | "SubtractionOperation"
        | "DivisionOperation"
        | "MultiplicationOperation";
    left: Value;
    right: Value;
}
