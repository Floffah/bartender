import { Value } from "./values";

/**
 * An object that represents a script tag.
 */
export interface Tag {
    /**
     * Object type
     */
    type: "Tag";
    /**
     * A string representing a value the tag is referencing
     */
    reference: string;
    /**
     * The tags parameters if its a call based tag.
     */
    params?: TagParam[];
}

/**
 * A type that represents any types that could be a tag parameter.
 */
export type TagParam = Value;
