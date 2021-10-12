import "source-map-support/register";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { resolve } from "path";
import { Context, Run, Runtime } from "..";
import chalk from "chalk";

const base = new Context();

base.addValues({
    version: "1.2.3",
    set: (proc, _tag, name: string, val: any) => {
        proc.variables[name] = val;
        return val;
    },
    print: (_proc, _tag, ...args: any[]) => {
        console.log(...args);
    },
    index: (_proc, _tag, number: number, array: any[]) => {
        return array[number];
    },
    "string.split": (_proc, _tag, string: string, splitter: string) => {
        return string.split(splitter);
    },
});

const testFile = (name: string) =>
    readFileSync(resolve(__dirname, "tests", name + ".bt"), "utf-8");
const tests: { [k: string]: string } = {
    versionSplitter: testFile("versionSplitter"),
    add: testFile("add"),
};
const runtime = Runtime.from(base);

const outdir = resolve(__dirname, "outs");

if (!existsSync(outdir)) mkdirSync(outdir);

(async () => {
    let continuing = true;

    for (const test of Object.keys(tests)) {
        if (continuing || process.argv.includes("--all")) {
            console.log(chalk`{blue ⋯ ${test}}`);
            const start = Date.now();
            try {
                // await runtime.run(tests[test]);
                const run = Run.from(runtime, runtime.context);
                await run.start(tests[test]);
                writeFileSync(
                    resolve(outdir, `${test}.parsed.json`),
                    JSON.stringify(run.parserOutput, null, 2), // 2 instead of 4 because these trees go DEEP
                );
                console.log(
                    chalk`    {green ✓ succeeded in ${Date.now() - start}ms}`,
                );
            } catch (e) {
                console.log(chalk`    {red ⨯ failed}`);
                console.log(
                    (e.stack as string)
                        .split("\n")
                        .map((s) => chalk`        {red ${s}}`)
                        .join("\n"),
                );
                continuing = false;
            }
        } else {
            console.log(chalk`{grey » skipping ${test}}`);
        }
    }

    if (!continuing) process.exit(1);
})();
