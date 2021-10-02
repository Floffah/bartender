import { readFileSync } from "fs";
import { resolve } from "path/posix";
import { Context } from "../"

const base = new Context();

base.addValues({
    version: "1.2.3",
});


const testFile = (name: string) => readFileSync(resolve(__dirname, "tests", name + ".bt"), "utf-8");
const tests = {
    versionSplitter: testFile("versionSplitter"),
}