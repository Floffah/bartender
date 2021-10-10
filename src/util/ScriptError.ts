import { Token } from "moo";

export class ScriptError extends Error {
    message: string;
    token: Token | { line: number; col: number };
    raw: string;

    constructor(
        msg: string,
        token: typeof ScriptError.prototype.token,
        raw: string,
    ) {
        let message = msg;

        const lines = raw.split("\n");
        const line = lines[token.line - 1];

        message += `\n  At line ${token.line} col ${token.col}:\n`;

        message += "  " + line + "\n";
        message += "^".padStart(token.col + 2, " ");

        super(message);
        this.message = message;
        this.token = token;
        this.raw = raw;
        Error.captureStackTrace(this, this.constructor);
    }
}
