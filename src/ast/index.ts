import { Token } from "moo";
import { Tag } from "./tags";

/**
 * The main type that represents the Bartender AST.
 */
export type AST = (Main | null)[];

/**
 * This is a container object that contains all of a scripts content.
 */
export interface Main {
    /**
     * Object type
     */
    type: "Main";
    /**
     * Script body
     */
    body: ScriptBody[];
}

/**
 * Type that represents any value that can be in a {@link Main} body
 */
export type ScriptBody = Tag | Plaintext | null;

/**
 * Object that represents literal text the user wrote in the script.
 */
export interface Plaintext {
    /**
     * Object type
     */
    type: "Plaintext";
    /**
     * The string value as a lexer token.
     */
    value: Token;
}

export * from "./tags";
export * from "./values";
