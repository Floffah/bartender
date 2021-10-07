import "source-map-support/register";
import { readFileSync } from "fs";
import { resolve } from "path";
import { Context, Runtime } from "..";
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
        if (continuing || process.argv.includes("--all")) {
            console.log(chalk`{blue ⋯ ${test}}`);
            const start = Date.now();
            try {
                await runtime.run(tests[test]);
                const time = Date.now() - start;
                if (time >= 100)
                    console.log(chalk`    {yellow ! Took more than 100ms}`);
                console.log(chalk`    {green ✓ succeeded in ${time}ms}`);
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
