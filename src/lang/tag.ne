@lexer lexer

Tag -> "{" %ws:? (%extraword|%word) ":":? %ws "}" {% d => ({ type: "Tag", reference: d[2] }) %}
