import "source-map-support/register";
import { readFileSync } from "fs";
import { resolve } from "path";
import { Runtime, Context } from "..";
import chalk from "chalk";

const base = new Context();

base.addValues({
    version: "1.2.3",
});

const testFile = (name: string) =>
    readFileSync(resolve(__dirname, "tests", name + ".bt"), "utf-8");
const tests: { [k: string]: string } = {
    versionSplitter: testFile("versionSplitter"),
    add: testFile("add"),
};
const runtime = Runtime.from(base);

(async () => {
    let continuing = true;

    for (const test of Object.keys(tests)) {
        if (continuing) {
            console.log(chalk`{blue ⋯ ${test}}`);
            try {
                await runtime.run(tests[test]);
                console.log(chalk`    {green ✓ succeeded}`);
            } catch (e) {
                console.log(chalk`    {red ⨯ failed}`);
                console.log(
                    e.stack
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
