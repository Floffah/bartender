import { Value } from "./values";

export interface Tag {
    type: "Tag",
    reference: string,
    params?: TagParam[]
}

export type TagParam = Value;