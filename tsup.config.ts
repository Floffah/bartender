import { Options } from "tsup";

export const tsup: Options = {
    target: "node12",
    entryPoints: ["./src/index.ts"],
    dts: true,
    clean: false,
    sourcemap: true,
};
