import cloudbase from "@cloudbase/js-sdk";
import type { Achievement, Person, Project, Story } from "@/src/types";

type CloudCollection = "projects" | "people" | "stories" | "achievements";
type CloudDocument = Record<string, unknown> & { _id?: unknown; _openid?: unknown };

const cloudRequests = new Map<CloudCollection, Promise<unknown[]>>();
let cloudApp: ReturnType<typeof cloudbase.init> | undefined;

export function getCloudbaseEnvId(): string {
  const envId = process.env.NEXT_PUBLIC_CLOUDBASE_ENV_ID;
  if (!envId) {
    throw new Error("NEXT_PUBLIC_CLOUDBASE_ENV_ID is not configured");
  }

  return envId;
}

export function getCloudApp() {
  cloudApp ??= cloudbase.init({
    env: getCloudbaseEnvId(),
    region: "ap-shanghai",
  });
  return cloudApp;
}

function getDatabase() {
  return getCloudApp().database();
}

function toContentDocument<T>(collection: CloudCollection, value: unknown): T {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`${collection} contains an invalid document`);
  }

  const document = Object.fromEntries(
    Object.entries(value as CloudDocument).filter(
      ([key]) => key !== "_id" && key !== "_openid",
    ),
  );
  return document as T;
}

async function getCloudCollection<T>(collection: CloudCollection): Promise<T[]> {
  const request = cloudRequests.get(collection) ?? getDatabase()
    .collection(collection)
    .limit(1000)
    .get()
    .then((result) => {
      if (!Array.isArray(result.data)) {
        throw new Error(`${collection} returned an invalid response`);
      }

      return result.data.map((document) => toContentDocument<T>(collection, document));
    });

  cloudRequests.set(collection, request);
  return request as Promise<T[]>;
}

export function getCloudProjects(): Promise<Project[]> {
  return getCloudCollection<Project>("projects");
}

export function getCloudPeople(): Promise<Person[]> {
  return getCloudCollection<Person>("people");
}

export function getCloudStories(): Promise<Story[]> {
  return getCloudCollection<Story>("stories");
}

export function getCloudAchievements(): Promise<Achievement[]> {
  return getCloudCollection<Achievement>("achievements");
}
