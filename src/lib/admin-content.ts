"use client";

import { getCloudApp } from "@/src/lib/cloudbase";
import type { Achievement, Person, Project, Story } from "@/src/types";

export type AdminCollection = "projects" | "people" | "stories" | "achievements";
export type AdminRole = "admin" | "editor";

export type AdminUser = {
  uid: string;
  username: string;
  displayName: string;
};

export type AdminMember = {
  uid: string;
  name: string;
  role: AdminRole;
  active: boolean;
};

export type AdminContentDocument = Project | Person | Story | Achievement;
export type StoredDocument<Document extends AdminContentDocument = AdminContentDocument> = Document & {
  _id: string;
};
export type StoredAdminDocument = StoredDocument;

export type AdminWorkspace = {
  projects: StoredDocument<Project>[];
  people: StoredDocument<Person>[];
  stories: StoredDocument<Story>[];
  achievements: StoredDocument<Achievement>[];
};

type CloudDocument = Record<string, unknown> & {
  _id?: unknown;
  _openid?: unknown;
};

function getDatabase() {
  return getCloudApp().database();
}

function getAuth() {
  return getCloudApp().auth();
}

function toStoredDocument<Document extends AdminContentDocument>(
  value: unknown,
): StoredDocument<Document> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("CloudBase 返回了无法识别的内容记录");
  }

  const document = value as CloudDocument;
  if (typeof document._id !== "string" || typeof document.id !== "string") {
    throw new Error("CloudBase 内容缺少 _id 或 id");
  }

  return document as StoredDocument<Document>;
}

function withoutSystemFields(document: AdminContentDocument): AdminContentDocument {
  return Object.fromEntries(
    Object.entries(document).filter(([key]) => key !== "_id" && key !== "_openid"),
  ) as AdminContentDocument;
}

async function getCollection<Document extends AdminContentDocument>(
  collection: AdminCollection,
): Promise<StoredDocument<Document>[]> {
  const result = await getDatabase().collection(collection).limit(1000).get();
  if (!Array.isArray(result.data)) {
    throw new Error(`无法读取 ${collection} 集合`);
  }

  return result.data
    .map((value) => toStoredDocument<Document>(value))
    .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));
}

export async function getAdminWorkspace(): Promise<AdminWorkspace> {
  const [projects, people, stories, achievements] = await Promise.all([
    getCollection<Project>("projects"),
    getCollection<Person>("people"),
    getCollection<Story>("stories"),
    getCollection<Achievement>("achievements"),
  ]);

  return { projects, people, stories, achievements };
}

export async function getCurrentAdminUser(): Promise<AdminUser | null> {
  const user = await getAuth().getCurrentUser();
  if (!user?.uid) return null;

  const username = user.username ?? user.email ?? user.uid;
  return {
    uid: user.uid,
    username,
    displayName: user.displayName ?? user.name ?? username,
  };
}

export async function getAdminMember(uid: string): Promise<AdminMember | null> {
  const result = await getDatabase().collection("cms_members").doc(uid).get();
  const value = Array.isArray(result.data) ? result.data[0] : result.data;
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;

  const member = value as Partial<AdminMember>;
  if (
    member.active !== true ||
    (member.role !== "admin" && member.role !== "editor")
  ) {
    return null;
  }

  return {
    uid,
    name: typeof member.name === "string" && member.name.trim() ? member.name : uid,
    role: member.role,
    active: true,
  };
}

export async function signInAdmin(username: string, password: string): Promise<void> {
  const result = await getAuth().signInWithPassword({
    username: username.trim(),
    password,
  }) as { error?: { message?: string } | null };

  if (result.error) {
    throw new Error(result.error.message ?? "账号或密码不正确");
  }
}

export async function signOutAdmin(): Promise<void> {
  await getAuth().signOut();
}

export async function saveAdminDocument(
  collection: AdminCollection,
  document: AdminContentDocument,
): Promise<void> {
  const content = withoutSystemFields(document);
  const existing = await getDatabase()
    .collection(collection)
    .where({ id: document.id })
    .limit(2)
    .get();

  if (!Array.isArray(existing.data)) {
    throw new Error("保存前无法检查内容标识");
  }
  if (existing.data.length > 1) {
    throw new Error(`数据库中存在重复 id：${document.id}`);
  }

  if (existing.data.length === 1) {
    const stored = toStoredDocument(existing.data[0]);
    await getDatabase().collection(collection).doc(stored._id).set(content);
    return;
  }

  await getDatabase().collection(collection).add(content);
}
