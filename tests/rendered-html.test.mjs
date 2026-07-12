import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const root = new URL("../", import.meta.url);

function file(path) {
  return new URL(path, root);
}

test("starter preview code has been removed", async () => {
  const packageJson = await readFile(file("package.json"), "utf8");
  const homePage = await readFile(file("app/page.tsx"), "utf8");

  assert.equal(existsSync(file("app/_sites-preview/SkeletonPreview.tsx")), false);
  assert.doesNotMatch(packageJson, /react-loading-skeleton|drizzle-kit|drizzle-orm/);
  assert.doesNotMatch(homePage, /codex-preview|SkeletonPreview/);
});

test("long-running archive structure exists", () => {
  const requiredFiles = [
    "src/config/site.ts",
    "src/data/projects.ts",
    "src/data/people.ts",
    "src/data/stories.ts",
    "src/data/achievements.ts",
    "src/lib/data.ts",
    "app/projects/[slug]/page.tsx",
    "app/people/[slug]/page.tsx",
    "app/stories/[slug]/page.tsx",
  ];

  for (const path of requiredFiles) {
    assert.equal(existsSync(file(path)), true, `${path} should exist`);
  }
});
