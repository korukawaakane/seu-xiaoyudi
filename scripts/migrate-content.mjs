import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import cloudbase from "@cloudbase/node-sdk";

const envId = "seu-raindrop-d6g2z4pmb6848dbf4";
const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const contentDirectory = path.resolve(scriptDirectory, "../src/content");

const collections = ["projects", "people", "stories", "achievements"];

function getRequiredCredential(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`缺少环境变量 ${name}。请先配置腾讯云 API 密钥后再执行迁移。`);
  }

  return value;
}

async function readCollectionEntries(collectionName) {
  const collectionDirectory = path.join(contentDirectory, collectionName);
  const entries = await readdir(collectionDirectory, { withFileTypes: true });
  const files = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
    .map((entry) => entry.name)
    .sort((left, right) => left.localeCompare(right));

  return Promise.all(
    files.map(async (fileName) => {
      const filePath = path.join(collectionDirectory, fileName);
      const rawJson = await readFile(filePath, "utf8");

      try {
        return { fileName, document: JSON.parse(rawJson) };
      } catch (error) {
        const detail = error instanceof Error ? error.message : String(error);
        throw new Error(`${collectionName}/${fileName} 不是有效 JSON：${detail}`);
      }
    }),
  );
}

async function migrateCollection(db, collectionName) {
  const entries = await readCollectionEntries(collectionName);
  console.log(`开始导入 ${collectionName}，共 ${entries.length} 个文件`);

  for (const { fileName, document } of entries) {
    await db.collection(collectionName).add(document);
    console.log(`✓ ${fileName}`);
  }

  console.log("");
}

async function main() {
  const secretId = getRequiredCredential("TENCENTCLOUD_SECRETID");
  const secretKey = getRequiredCredential("TENCENTCLOUD_SECRETKEY");
  const sessionToken = process.env.TENCENTCLOUD_SESSIONTOKEN;

  const app = cloudbase.init({
    env: envId,
    secretId,
    secretKey,
    ...(sessionToken ? { sessionToken } : {}),
  });
  const db = app.database();

  for (const collectionName of collections) {
    await migrateCollection(db, collectionName);
  }

  console.log("🎉 全部内容迁移完成");
}

main().catch((error) => {
  console.error("内容迁移失败：", error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
