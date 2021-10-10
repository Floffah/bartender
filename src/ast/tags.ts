import { Value } from "./values";

/**
 * An object that represents a script tag.
 */
export interface Tag {
    type: "Tag";
    reference: string;
    params?: TagParam[];
}

/**
 * A type that represents any types that could be a tag parameter.
 */
export type TagParam = Value;
