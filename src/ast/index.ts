import { Token } from "moo";
import { Tag } from "./tags";

export type AST = (Main|null)[];

export interface Main {
    type: "Main",
    body: ScriptBody[]
}

export type ScriptBody = Tag|Plaintext;

export interface Plaintext {
    type: "Plaintext",
    value: Token
}

export * from "./tags";
export * from "./values"