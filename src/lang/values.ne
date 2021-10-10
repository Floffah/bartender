@lexer lexer

@include "./tag.ne"

value -> allvalues {% d => ({ type: "Value", value: d[0] }) %}

tagvalues -> Tag {% id %}

valuevalues -> %word {% d => ({ type: "LiteralReferenceValue", name: d[0] }) %}
    | %string {% d => ({ type: "StringValue", value: d[0] }) %}
    | (%number | %decimal) {% d => ({ type: "NumberValue", value: d[0] }) %}

expressionvalues -> expressionablevalues %ws:? "+" %ws:? expressionablevalues {% d => ({ type: "Operation", operationType: "AdditionOperation", left: d[0], right: d[4] }) %}
    | expressionablevalues %ws:? "-" %ws:? expressionablevalues {% d => ({ type: "Operation", operationType: "SubtractionOperation", left: d[0], right: d[4] }) %}
    | expressionablevalues %ws:? "/" %ws:? expressionablevalues {% d => ({ type: "Operation", operationType: "DivisionOperation", left: d[0], right: d[4] }) %}
    | expressionablevalues %ws:? "*" %ws:? expressionablevalues {% d => ({ type: "Operation", operationType: "MultiplicationOperation", left: d[0], right: d[4] }) %}

allvalues -> tagvalues {% id %}
    | valuevalues {% id %}
    | expressionvalues {% id %}

expressionablevalues -> valuevalues {% id %}
    | expressionvalues {% id %}
