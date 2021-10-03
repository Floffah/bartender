@lexer lexer

@include "./values.ne"

Tag -> "{" %ws:? (%word|%extraword):+ OptionalTagParams:? %ws:? "}" {% d => ({ type: "Tag", reference: d[2].map((w: any) => w.value).join(""), ...(d[3] ?? {}) }) %}

OptionalTagParams -> ":":? %ws value ExtraTagParams:* {% d => ({ params: [d[2], ...(d[3] ?? [])] }) %}

ExtraTagParams -> "," %ws:? value {% d => d[2] %}