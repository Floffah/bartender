import { readFileSync } from "fs";
import { resolve } from "path";
import { Runtime, Context } from "src";
import chalk from "chalk";

const base = new Context();

base.addValues({
    version: "1.2.3",
});

const testFile = (name: string) =>
    readFileSync(resolve(__dirname, "tests", name + ".bt"), "utf-8");
const tests: { [k: string]: string } = {
    versionSplitter: testFile("versionSplitter"),
};
const runtime = Runtime.from(base);

for (const test of Object.keys(tests)) {
    console.log(chalk`{blue test ${test}}`);
    try {
        runtime.run(tests[test]);
        console.log(chalk`    {green succeeded}`);
    } catch (e) {
        console.log(chalk`    {red failed}`);
        console.log(e.stack);
    }
}
