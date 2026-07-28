"use client";

import { getCloudApp, getCloudbaseEnvId } from "@/src/lib/cloudbase";
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

type CloudAuthResponse = {
  access_token?: unknown;
  refresh_token?: unknown;
  expires_in?: unknown;
  token_type?: unknown;
  scope?: unknown;
  sub?: unknown;
  code?: unknown;
  error?: unknown;
  error_description?: unknown;
};

type CloudCredentials = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type?: string;
  scope?: string;
};

type LocalAuth = {
  getCredentials(): Promise<CloudCredentials | null>;
  setCredentials(credentials: CloudCredentials | null): Promise<void>;
};

function getDatabase() {
  return getCloudApp().database();
}

function getAuth() {
  return getCloudApp().auth();
}

function getLocalAuth(): LocalAuth {
  return getAuth() as unknown as LocalAuth;
}

function getAdminSessionStorageKey(): string {
  return `raindrop-cms-user:${getCloudbaseEnvId()}`;
}

function cacheAdminUser(user: AdminUser): void {
  window.localStorage.setItem(getAdminSessionStorageKey(), JSON.stringify(user));
}

function clearCachedAdminUser(): void {
  window.localStorage.removeItem(getAdminSessionStorageKey());
}

function getCachedAdminUser(): AdminUser | null {
  const value = window.localStorage.getItem(getAdminSessionStorageKey());
  if (!value) return null;

  try {
    const user = JSON.parse(value) as Partial<AdminUser>;
    if (
      typeof user.uid !== "string" ||
      typeof user.username !== "string" ||
      typeof user.displayName !== "string"
    ) {
      clearCachedAdminUser();
      return null;
    }

    return {
      uid: user.uid,
      username: user.username,
      displayName: user.displayName,
    };
  } catch {
    clearCachedAdminUser();
    return null;
  }
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
  const user = getCachedAdminUser();
  if (!user) return null;

  const credentials = await getLocalAuth().getCredentials();
  if (typeof credentials?.access_token !== "string") {
    clearCachedAdminUser();
    return null;
  }

  return user;
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
  const envId = getCloudbaseEnvId();
  let response: Response;

  try {
    response = await fetch(
      `https://${envId}.ap-shanghai.tcb-api.tencentcloudapi.com/auth/v1/signin?client_id=${encodeURIComponent(envId)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.trim(),
          password,
        }),
      },
    );
  } catch {
    throw new Error("无法连接 CloudBase 登录服务，请检查网络后重试");
  }

  let payload: CloudAuthResponse = {};
  try {
    payload = await response.json() as CloudAuthResponse;
  } catch {
    if (!response.ok) {
      throw new Error(`CloudBase 登录服务返回异常（${response.status}）`);
    }
  }

  if (!response.ok) {
    if (
      payload.code === "INVALID_USERNAME_OR_PASSWORD" ||
      payload.error === "invalid_username_or_password"
    ) {
      throw new Error("用户名或密码不正确");
    }
    if (payload.error === "captcha_required") {
      throw new Error("登录尝试次数过多，请稍后再试");
    }
    if (payload.error === "invalid_status") {
      throw new Error("账号暂时被锁定，请稍后再试");
    }

    const detail = typeof payload.error_description === "string"
      ? payload.error_description
      : typeof payload.error === "string"
        ? payload.error
        : `状态码 ${response.status}`;
    throw new Error(`CloudBase 登录失败：${detail}`);
  }

  if (
    typeof payload.access_token !== "string" ||
    typeof payload.refresh_token !== "string" ||
    typeof payload.expires_in !== "number" ||
    typeof payload.sub !== "string"
  ) {
    throw new Error("CloudBase 登录服务未返回完整会话信息");
  }

  const credentials: CloudCredentials = {
    access_token: payload.access_token,
    refresh_token: payload.refresh_token,
    expires_in: payload.expires_in,
  };
  if (typeof payload.token_type === "string") {
    credentials.token_type = payload.token_type;
  }
  if (typeof payload.scope === "string") {
    credentials.scope = payload.scope;
  }

  try {
    await getLocalAuth().setCredentials(credentials);
    cacheAdminUser({
      uid: payload.sub,
      username: username.trim(),
      displayName: username.trim(),
    });
  } catch {
    clearCachedAdminUser();
    throw new Error("浏览器无法保存登录状态，请检查隐私或存储设置");
  }
}

export async function signOutAdmin(): Promise<void> {
  try {
    await getAuth().signOut();
  } catch {
    // The local session must still be removed when CloudBase is unreachable.
  }

  await getLocalAuth().setCredentials(null);
  clearCachedAdminUser();
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
