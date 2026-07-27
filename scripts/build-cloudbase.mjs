import { execFileSync } from "node:child_process";
import { resolve } from "node:path";

await import("./generate-content-index.mjs");

const nextCli = resolve("node_modules/next/dist/bin/next");

execFileSync(process.execPath, [nextCli, "build"], {
  stdio: "inherit",
  env: {
    ...process.env,
    CLOUDBASE_STATIC_EXPORT: "1",
  },
});
