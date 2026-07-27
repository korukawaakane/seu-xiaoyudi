import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import cloudbase from "@cloudbase/node-sdk";

type ContentCollection = "projects" | "people" | "stories" | "achievements";
type ContentDocument = Record<string, any> & { id: string };
type ContentFile = { fileName: string; document: ContentDocument };

const contentRoot = path.resolve(process.cwd(), "src/content");
let database: ReturnType<ReturnType<typeof cloudbase.init>["database"]> | undefined;

function loadLocalEnvironment() {
  try {
    process.loadEnvFile(path.resolve(process.cwd(), ".env.local"));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      throw error;
    }
  }
}

function getRequiredEnvironment(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function getDatabase() {
  if (database) return database;

  loadLocalEnvironment();
  const secretId = getRequiredEnvironment("TENCENTCLOUD_SECRETID");
  const secretKey = getRequiredEnvironment("TENCENTCLOUD_SECRETKEY");
  const sessionToken = process.env.TENCENTCLOUD_SESSIONTOKEN;
  const app = cloudbase.init({
    env: getRequiredEnvironment("CLOUDBASE_ENV_ID"),
    secretId,
    secretKey,
    ...(sessionToken ? { sessionToken } : {}),
  });

  database = app.database();
  return database;
}

function parseDocument(collection: ContentCollection, fileName: string, rawJson: string): ContentDocument {
  try {
    const document = JSON.parse(rawJson) as unknown;
    if (!document || typeof document !== "object" || Array.isArray(document)) {
      throw new Error("JSON root must be an object");
    }
    if (typeof (document as ContentDocument).id !== "string" || !(document as ContentDocument).id) {
      throw new Error("JSON document must contain a non-empty string id");
    }

    return document as ContentDocument;
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    throw new Error(`${collection}/${fileName}: ${detail}`);
  }
}

async function readCollectionFiles(collection: ContentCollection): Promise<ContentFile[]> {
  const directory = path.join(contentRoot, collection);
  const entries = await readdir(directory, { withFileTypes: true });
  const fileNames = entries
    .filter((entry) => entry.isFile() && path.extname(entry.name) === ".json")
    .map((entry) => entry.name)
    .sort((left, right) => left.localeCompare(right));

  return Promise.all(
    fileNames.map(async (fileName) => ({
      fileName,
      document: parseDocument(
        collection,
        fileName,
        await readFile(path.join(directory, fileName), "utf8"),
      ),
    })),
  );
}

async function upsertDocument(collectionName: ContentCollection, document: ContentDocument) {
  const collection = getDatabase().collection(collectionName);
  const existing = await collection.where({ id: document.id }).limit(2).get();

  if (existing.data.length > 1) {
    throw new Error(`${collectionName} contains duplicate documents for id "${document.id}"`);
  }

  if (existing.data.length === 1) {
    const documentId = existing.data[0]._id;
    if (typeof documentId !== "string") {
      throw new Error(`${collectionName} document "${document.id}" has no valid CloudBase _id`);
    }

    await collection.doc(documentId).set(document);
    return "updated";
  }

  await collection.add(document);
  return "created";
}

async function importCollection(collection: ContentCollection) {
  const files = await readCollectionFiles(collection);
  console.log(`Importing ${collection}: ${files.length} file(s)`);

  for (const { fileName, document } of files) {
    const operation = await upsertDocument(collection, document);
    console.log(`  ${operation === "created" ? "+" : "~"} ${fileName}`);
  }
}

export async function importProjects() {
  await importCollection("projects");
}

export async function importPeople() {
  await importCollection("people");
}

export async function importStories() {
  await importCollection("stories");
}

export async function importAchievements() {
  await importCollection("achievements");
}

async function main() {
  await importProjects();
  await importPeople();
  await importStories();
  await importAchievements();
  console.log("CloudBase content import complete.");
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
