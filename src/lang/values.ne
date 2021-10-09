@lexer lexer

@include "./tag.ne"

value -> (tagvalues|valuevalues|expressionvalues) {% d => ({ type: "Value", value: d[0] }) %}

tagvalues -> Tag {% id %}

valuevalues -> %word {% d => ({ type: "LiteralReferenceValue", name: d[0] }) %}
    | %string {% d => ({ type: "StringValue", value: d[0] }) %}
    | (%number | %decimal) {% d => ({ type: "NumberValue", value: d[0] }) %}

expressionvalues -> expressionablevalues %ws:? "+" %ws:? expressionablevalues {% d => ({ type: "AdditionOperation", left: d[0], right: d[4] }) %}
    | expressionablevalues %ws:? "-" %ws:? expressionablevalues {% d => ({ type: "SubtractionOperation", left: d[0], right: d[4] }) %}
    | expressionablevalues %ws:? "/" %ws:? expressionablevalues {% d => ({ type: "DivisionOperation", left: d[0], right: d[4] }) %}
    | expressionablevalues %ws:? "*" %ws:? expressionablevalues {% d => ({ type: "MultiplicationOperation", left: d[0], right: d[4] }) %}

expressionablevalues -> valuevalues {% id %}
    | expressionvalues {% id %}