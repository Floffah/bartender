@lexer lexer

Tag -> "{" %ws:? %extraword "}" {% d => ({ type: "Tag", reference: d[2] }) %}
