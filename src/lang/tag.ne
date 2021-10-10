@lexer lexer

@include "./values.ne"

Tag -> "{" %ws:? (%word|%extraword):+ OptionalTagParams:? %ws:? "}" {% d => {
    const referenceTokens = d[2].map((w: Token|Token[]) => Array.isArray(w) ? w[0] : w);

    return {
        type: "Tag",
        reference: referenceTokens.map((v: Token) => v.value).join(""),
        referenceLoc: {
            line: referenceTokens[0].line,
            col: referenceTokens[0].col,
        },
        ...(d[3] ?? {}),
    }
} %}

OptionalTagParams -> ":":? %ws value ExtraTagParams:* {% d => ({ params: [d[2], ...(d[3] ?? [])] }) %}

ExtraTagParams -> "," %ws:? value {% d => d[2] %}
