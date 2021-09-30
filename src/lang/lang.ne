@preprocessor typescript

@{%
import { compile, Rules } from "moo";

export const nuller = () => null;

export const lexerRules: Rules = {
    ws: {
        match: /\s+/,
        lineBreaks: true,
    },
    number: {
        match: /[0-9]+/,
        lineBreaks: false,
    },
    word: {
        match: /[A-z0-9_$]+/,
        lineBreaks: false,
    },
    string: {
        match: /["'].+["']/,
        lineBreaks: false,
        value: v => v.slice(1, -1)
    },
}
%}

@lexer lexer

Prog -> Main:+ {% d => ({ type: "Main", body: d[0] }) %}

Main -> %ws {% nuller %}

@{%
export const lexer = compile({
    ...lexerRules,
})
%}
