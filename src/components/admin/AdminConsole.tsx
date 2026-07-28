"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Archive,
  Database,
  FileText,
  FolderArchive,
  LogOut,
  Plus,
  RefreshCw,
  Save,
  Search,
  ShieldCheck,
  Trophy,
  UserRound,
} from "lucide-react";
import { AdminEditor } from "@/src/components/admin/AdminEditor";
import {
  getAdminMember,
  getAdminWorkspace,
  getCurrentAdminUser,
  saveAdminDocument,
  signInAdmin,
  signOutAdmin,
  type AdminCollection,
  type AdminContentDocument,
  type AdminMember,
  type AdminUser,
  type AdminWorkspace,
  type StoredAdminDocument,
} from "@/src/lib/admin-content";
import type {
  Achievement,
  ContentStatus,
  Person,
  Project,
  Story,
} from "@/src/types";

type ConsolePhase = "checking" | "signed-out" | "denied" | "ready" | "error";
type SessionSnapshot =
  | { phase: "signed-out" }
  | { phase: "denied"; user: AdminUser }
  | {
      phase: "ready";
      user: AdminUser;
      member: AdminMember;
      workspace: AdminWorkspace;
    };

const collectionDefinitions = [
  { id: "projects", label: "项目", icon: FolderArchive },
  { id: "people", label: "人物", icon: UserRound },
  { id: "stories", label: "纪实", icon: FileText },
  { id: "achievements", label: "成果", icon: Trophy },
] satisfies Array<{
  id: AdminCollection;
  label: string;
  icon: typeof FolderArchive;
}>;

const emptyWorkspace: AdminWorkspace = {
  projects: [],
  people: [],
  stories: [],
  achievements: [],
};

const statusLabels: Record<ContentStatus, string> = {
  draft: "草稿",
  review: "待审核",
  published: "已发布",
  archived: "已归档",
};

const statusClasses: Record<ContentStatus, string> = {
  draft: "bg-paper text-muted",
  review: "bg-[#f7ecd9] text-bronze-dark",
  published: "bg-[#e7f3eb] text-[#28613c]",
  archived: "bg-[#ececec] text-[#555]",
};

function getDocumentTitle(document: AdminContentDocument): string {
  return "name" in document ? document.name : document.title;
}

function createStableId(collection: AdminCollection): string {
  const prefix: Record<AdminCollection, string> = {
    projects: "project",
    people: "person",
    stories: "story",
    achievements: "achievement",
  };
  return `${prefix[collection]}-${Date.now().toString(36)}`;
}

function createMetadata(user: AdminUser) {
  const now = new Date().toISOString();
  return {
    createdBy: user.displayName,
    createdAt: now,
    updatedBy: user.displayName,
    updatedAt: now,
    source: "内容管理后台录入",
  };
}

function createDocument(
  collection: AdminCollection,
  user: AdminUser,
): AdminContentDocument {
  const id = createStableId(collection);
  const today = new Date().toISOString().slice(0, 10);
  const metadata = createMetadata(user);

  if (collection === "projects") {
    return {
      ...metadata,
      id,
      slug: id,
      title: "",
      year: new Date().getFullYear(),
      semester: "暑期社会实践",
      location: "",
      theme: "",
      summary: "",
      background: "",
      purpose: "",
      coverImage: "/images/placeholders/project-cover.svg",
      slogan: "",
      featured: false,
      status: "draft",
      tags: [],
      personIds: [],
      storyIds: [],
      achievementIds: [],
      timeline: [],
      gallery: [],
      teamIds: [],
      sources: [],
      startDate: today,
      endDate: "",
      reflections: [],
    } satisfies Project;
  }

  if (collection === "people") {
    return {
      ...metadata,
      id,
      slug: id,
      name: "",
      category: "",
      years: "",
      birthplace: "",
      identity: "",
      summary: "",
      biography: "",
      portrait: "/images/placeholders/person-portrait.svg",
      keywords: [],
      projectIds: [],
      timeline: [],
      gallery: [],
      storyIds: [],
      sources: [],
      deeds: [],
      status: "draft",
    } satisfies Person;
  }

  if (collection === "stories") {
    return {
      ...metadata,
      id,
      slug: id,
      title: "",
      date: today,
      category: "实践记录",
      summary: "",
      content: [],
      coverImage: "/images/placeholders/story-cover.svg",
      projectId: "",
      author: user.displayName,
      gallery: [],
      tags: [],
      featured: false,
      status: "draft",
    } satisfies Story;
  }

  return {
    ...metadata,
    id,
    slug: id,
    title: "",
    type: "调研报告",
    summary: "",
    projectId: "",
    creators: [],
    publishDate: today,
    previewUrl: null,
    fileUrl: null,
    status: "draft",
    assetStatus: "整理中",
    coverImage: "/images/placeholders/achievement-cover.svg",
  } satisfies Achievement;
}

function validateDocument(
  collection: AdminCollection,
  document: AdminContentDocument,
): string | null {
  if (!document.id.trim() || !document.slug.trim()) return "内容标识不能为空";

  if (collection === "projects") {
    const project = document as Project;
    if (!project.title.trim()) return "请填写项目名称";
    if (!project.location.trim()) return "请填写实践地点";
    if (!project.theme.trim()) return "请填写项目主题";
    if (!project.summary.trim()) return "请填写项目简介";
    if (!project.background.trim()) return "请填写实践背景";
    if (!project.purpose.trim()) return "请填写实践目的";
  }

  if (collection === "people") {
    const person = document as Person;
    if (!person.name.trim()) return "请填写人物姓名";
    if (!person.category.trim()) return "请填写人物分类";
    if (!person.summary.trim()) return "请填写人物简介";
    if (!person.biography.trim()) return "请填写人物正文";
  }

  if (collection === "stories") {
    const story = document as Story;
    if (!story.title.trim()) return "请填写文章标题";
    if (!story.projectId) return "请选择所属项目";
    if (!story.author.trim()) return "请填写作者或整理人员";
    if (!story.summary.trim()) return "请填写文章摘要";
    if (!story.content.length) return "请填写文章正文";
  }

  if (collection === "achievements") {
    const achievement = document as Achievement;
    if (!achievement.title.trim()) return "请填写成果名称";
    if (!achievement.projectId) return "请选择所属项目";
    if (!achievement.summary.trim()) return "请填写成果摘要";
  }

  return null;
}

async function loadSessionSnapshot(): Promise<SessionSnapshot> {
  const currentUser = await getCurrentAdminUser();
  if (!currentUser) return { phase: "signed-out" };

  const currentMember = await getAdminMember(currentUser.uid);
  if (!currentMember) {
    return { phase: "denied", user: currentUser };
  }

  return {
    phase: "ready",
    user: currentUser,
    member: currentMember,
    workspace: await getAdminWorkspace(),
  };
}

function LoginPanel({
  error,
  onSubmit,
  submitting,
}: {
  error: string;
  onSubmit: (username: string, password: string) => Promise<void>;
  submitting: boolean;
}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <section className="mx-auto my-16 w-full max-w-md rounded-[8px] border border-line bg-white p-6 shadow-soft sm:p-8">
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-[8px] bg-brand text-white">
          <ShieldCheck aria-hidden="true" size={21} />
        </span>
        <div>
          <p className="text-xs font-semibold text-brand">RAINDROP CMS</p>
          <h1 className="font-serif text-2xl font-semibold text-ink">成员登录</h1>
        </div>
      </div>

      <form
        className="mt-7 grid gap-5"
        onSubmit={(event) => {
          event.preventDefault();
          void onSubmit(username, password);
        }}
      >
        <label className="grid gap-2">
          <span className="text-sm font-semibold text-ink">用户名</span>
          <input
            autoComplete="username"
            className="field-control"
            onChange={(event) => setUsername(event.target.value)}
            required
            value={username}
          />
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-semibold text-ink">密码</span>
          <input
            autoComplete="current-password"
            className="field-control"
            onChange={(event) => setPassword(event.target.value)}
            required
            type="password"
            value={password}
          />
        </label>
        {error ? (
          <p className="rounded-[8px] border border-brand/25 bg-brand/5 px-3 py-2 text-sm text-brand" role="alert">
            {error}
          </p>
        ) : null}
        <button className="btn-primary w-full" disabled={submitting} type="submit">
          {submitting ? <RefreshCw aria-hidden="true" className="animate-spin" size={18} /> : <ShieldCheck aria-hidden="true" size={18} />}
          {submitting ? "正在登录" : "登录后台"}
        </button>
      </form>
    </section>
  );
}

export function AdminConsole() {
  const [phase, setPhase] = useState<ConsolePhase>("checking");
  const [user, setUser] = useState<AdminUser | null>(null);
  const [member, setMember] = useState<AdminMember | null>(null);
  const [workspace, setWorkspace] = useState<AdminWorkspace>(emptyWorkspace);
  const [collection, setCollection] = useState<AdminCollection>("projects");
  const [selectedId, setSelectedId] = useState("");
  const [document, setDocument] = useState<AdminContentDocument | null>(null);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);

  function applySessionSnapshot(snapshot: SessionSnapshot) {
    if (snapshot.phase === "signed-out") {
      setUser(null);
      setMember(null);
      setPhase("signed-out");
      return;
    }

    setUser(snapshot.user);
    if (snapshot.phase === "denied") {
      setMember(null);
      setPhase("denied");
      return;
    }

    const nextWorkspace = snapshot.workspace;
    const initialDocument = nextWorkspace.projects[0];
    setMember(snapshot.member);
    setWorkspace(nextWorkspace);
    setCollection("projects");
    setSelectedId(initialDocument?.id ?? "");
    setDocument(initialDocument ? { ...initialDocument } : null);
    setPhase("ready");
  }

  useEffect(() => {
    let active = true;
    void loadSessionSnapshot()
      .then((snapshot) => {
        if (active) applySessionSnapshot(snapshot);
      })
      .catch((cause) => {
        if (!active) return;
        setError(cause instanceof Error ? cause.message : "后台初始化失败");
        setPhase("error");
      });
    return () => {
      active = false;
    };
  }, []);

  const filteredDocuments = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    if (!normalizedQuery) return workspace[collection];
    return workspace[collection].filter((item) =>
      [item.id, getDocumentTitle(item), item.status]
        .join(" ")
        .toLocaleLowerCase()
        .includes(normalizedQuery),
    );
  }, [collection, query, workspace]);

  async function handleLogin(username: string, password: string) {
    setBusy(true);
    setError("");
    setPhase("checking");
    try {
      await signInAdmin(username, password);
      applySessionSnapshot(await loadSessionSnapshot());
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "登录失败");
      setPhase("signed-out");
    } finally {
      setBusy(false);
    }
  }

  async function handleSignOut() {
    setBusy(true);
    try {
      await signOutAdmin();
      setWorkspace(emptyWorkspace);
      setDocument(null);
      setUser(null);
      setMember(null);
      setPhase("signed-out");
    } finally {
      setBusy(false);
    }
  }

  function selectDocument(item: StoredAdminDocument) {
    setSelectedId(item.id);
    setDocument({ ...item });
    setNotice("");
    setError("");
  }

  function startNewDocument() {
    if (!user) return;
    const nextDocument = createDocument(collection, user);
    setSelectedId(nextDocument.id);
    setDocument(nextDocument);
    setNotice("");
    setError("");
  }

  async function reloadWorkspace() {
    setBusy(true);
    setError("");
    try {
      const nextWorkspace = await getAdminWorkspace();
      const nextDocument = nextWorkspace[collection].find((item) => item.id === selectedId)
        ?? nextWorkspace[collection][0];
      setWorkspace(nextWorkspace);
      setSelectedId(nextDocument?.id ?? "");
      setDocument(nextDocument ? { ...nextDocument } : null);
      setNotice("内容列表已刷新");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "刷新失败");
    } finally {
      setBusy(false);
    }
  }

  async function handleSave() {
    if (!document || !member || !user) return;
    const validationError = validateDocument(collection, document);
    if (validationError) {
      setError(validationError);
      setNotice("");
      return;
    }

    setBusy(true);
    setError("");
    setNotice("");
    const now = new Date().toISOString();
    const nextStatus: ContentStatus =
      member.role === "editor" && !["draft", "review"].includes(document.status)
        ? "review"
        : document.status;
    const nextDocument = {
      ...document,
      status: nextStatus,
      updatedBy: member.name || user.displayName,
      updatedAt: now,
    } as AdminContentDocument;

    try {
      await saveAdminDocument(collection, nextDocument);
      const nextWorkspace = await getAdminWorkspace();
      setWorkspace(nextWorkspace);
      setSelectedId(nextDocument.id);
      setDocument(
        nextWorkspace[collection].find((item) => item.id === nextDocument.id)
          ?? nextDocument,
      );
      setNotice(nextStatus === "review" ? "已保存并提交审核" : "内容已保存");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "保存失败");
    } finally {
      setBusy(false);
    }
  }

  if (phase === "checking") {
    return (
      <section className="grid min-h-[60vh] place-items-center bg-paper">
        <div className="flex items-center gap-3 text-sm font-semibold text-muted">
          <RefreshCw aria-hidden="true" className="animate-spin text-brand" size={20} />
          正在连接内容库
        </div>
      </section>
    );
  }

  if (phase === "signed-out") {
    return <LoginPanel error={error} onSubmit={handleLogin} submitting={busy} />;
  }

  if (phase === "denied" || phase === "error") {
    return (
      <section className="mx-auto my-16 w-full max-w-xl rounded-[8px] border border-line bg-white p-7 shadow-soft">
        <div className="flex items-start gap-4">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[8px] bg-brand/10 text-brand">
            <ShieldCheck aria-hidden="true" size={21} />
          </span>
          <div className="min-w-0">
            <h1 className="font-serif text-2xl font-semibold text-ink">
              {phase === "denied" ? "账号尚未加入内容组" : "后台连接失败"}
            </h1>
            <p className="mt-3 break-all text-sm leading-7 text-muted">
              {phase === "denied" ? `当前账号 UID：${user?.uid ?? "未知"}` : error}
            </p>
            <button className="btn-secondary mt-6" disabled={busy} onClick={() => void handleSignOut()} type="button">
              <LogOut aria-hidden="true" size={18} />
              退出账号
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (!user || !member) return null;

  const activeDefinition = collectionDefinitions.find((item) => item.id === collection)!;
  const ActiveCollectionIcon = activeDefinition.icon;

  return (
    <div className="min-h-screen bg-[#f4f4f2]">
      <section className="border-b border-line bg-white">
        <div className="mx-auto flex w-full max-w-[1500px] flex-col gap-5 px-4 py-6 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-brand">
              <Database aria-hidden="true" size={15} />
              CLOUDBASE CONTENT
            </div>
            <h1 className="mt-2 font-serif text-3xl font-semibold text-ink">内容管理后台</h1>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="border-r border-line pr-4 text-right">
              <p className="text-sm font-semibold text-ink">{member.name}</p>
              <p className="text-xs text-muted">{member.role === "admin" ? "管理员" : "内容编辑"}</p>
            </div>
            <button
              aria-label="刷新内容"
              className="icon-button"
              disabled={busy}
              onClick={() => void reloadWorkspace()}
              title="刷新内容"
              type="button"
            >
              <RefreshCw aria-hidden="true" className={busy ? "animate-spin" : ""} size={19} />
            </button>
            <button className="btn-secondary" disabled={busy} onClick={() => void handleSignOut()} type="button">
              <LogOut aria-hidden="true" size={18} />
              退出
            </button>
          </div>
        </div>
      </section>

      <div className="border-b border-line bg-paper">
        <div className="mx-auto flex w-full max-w-[1500px] gap-1 overflow-x-auto px-4 py-2 sm:px-6 lg:px-8" role="tablist">
          {collectionDefinitions.map((item) => {
            const Icon = item.icon;
            const active = item.id === collection;
            return (
              <button
                aria-selected={active}
                className={active
                  ? "flex min-h-11 shrink-0 items-center gap-2 rounded-[8px] bg-brand px-4 text-sm font-semibold text-white"
                  : "flex min-h-11 shrink-0 items-center gap-2 rounded-[8px] px-4 text-sm font-semibold text-muted hover:bg-white hover:text-ink"}
                key={item.id}
                onClick={() => {
                  const nextDocument = workspace[item.id][0];
                  setCollection(item.id);
                  setQuery("");
                  setSelectedId(nextDocument?.id ?? "");
                  setDocument(nextDocument ? { ...nextDocument } : null);
                  setNotice("");
                  setError("");
                }}
                role="tab"
                type="button"
              >
                <Icon aria-hidden="true" size={17} />
                {item.label}
                <span className={active ? "text-white/70" : "text-muted"}>
                  {workspace[item.id].length}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mx-auto grid w-full max-w-[1500px] lg:grid-cols-[20rem_minmax(0,1fr)]">
        <aside className="border-b border-line bg-white lg:min-h-[calc(100vh-15rem)] lg:border-r lg:border-b-0">
          <div className="flex items-center gap-2 border-b border-line p-4">
            <label className="relative min-w-0 flex-1">
              <span className="sr-only">搜索{activeDefinition.label}</span>
              <Search aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={17} />
              <input
                className="field-control pl-9"
                onChange={(event) => setQuery(event.target.value)}
                placeholder={`搜索${activeDefinition.label}`}
                value={query}
              />
            </label>
            <button
              aria-label={`新增${activeDefinition.label}`}
              className="icon-button shrink-0"
              onClick={startNewDocument}
              title={`新增${activeDefinition.label}`}
              type="button"
            >
              <Plus aria-hidden="true" size={19} />
            </button>
          </div>
          <div className="max-h-[26rem] overflow-y-auto lg:max-h-[calc(100vh-20rem)]">
            {filteredDocuments.length ? (
              filteredDocuments.map((item) => (
                <button
                  className={item.id === selectedId
                    ? "block w-full border-b border-line border-l-4 border-l-brand bg-paper px-4 py-4 text-left"
                    : "block w-full border-b border-line border-l-4 border-l-transparent px-4 py-4 text-left hover:bg-paper"}
                  key={item.id}
                  onClick={() => selectDocument(item)}
                  type="button"
                >
                  <span className="block truncate text-sm font-semibold text-ink">{getDocumentTitle(item)}</span>
                  <span className="mt-2 flex items-center justify-between gap-2">
                    <span className={`rounded-[6px] px-2 py-1 text-xs font-semibold ${statusClasses[item.status]}`}>
                      {statusLabels[item.status]}
                    </span>
                    <span className="truncate text-xs text-muted">{item.id}</span>
                  </span>
                </button>
              ))
            ) : (
              <div className="px-5 py-10 text-center text-sm text-muted">
                <Archive aria-hidden="true" className="mx-auto mb-3 text-line" size={28} />
                暂无内容
              </div>
            )}
          </div>
        </aside>

        <section className="min-w-0 bg-white">
          {document ? (
            <>
              <div className="sticky top-20 z-30 flex flex-col gap-4 border-b border-line bg-white/95 px-4 py-4 backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-brand">{activeDefinition.label}内容</p>
                  <h2 className="mt-1 truncate font-serif text-xl font-semibold text-ink">
                    {getDocumentTitle(document) || `新增${activeDefinition.label}`}
                  </h2>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  {error ? <p className="text-sm font-semibold text-brand" role="alert">{error}</p> : null}
                  {notice ? <p className="text-sm font-semibold text-[#28613c]" role="status">{notice}</p> : null}
                  <button className="btn-primary" disabled={busy} onClick={() => void handleSave()} type="button">
                    {busy ? <RefreshCw aria-hidden="true" className="animate-spin" size={18} /> : <Save aria-hidden="true" size={18} />}
                    {member.role === "editor" ? "保存并送审" : "保存内容"}
                  </button>
                </div>
              </div>
              <div className="grid gap-8 px-4 py-7 sm:px-6 lg:px-8 lg:py-9">
                <AdminEditor
                  collection={collection}
                  document={document}
                  onChange={(nextDocument) => {
                    setDocument(nextDocument);
                    setError("");
                    setNotice("");
                  }}
                  projects={workspace.projects}
                  role={member.role}
                />
              </div>
            </>
          ) : (
            <div className="grid min-h-[34rem] place-items-center p-8 text-center">
              <div>
                <ActiveCollectionIcon aria-hidden="true" className="mx-auto text-line" size={36} />
                <h2 className="mt-4 font-serif text-xl font-semibold text-ink">尚未选择内容</h2>
                <button className="btn-primary mt-6" onClick={startNewDocument} type="button">
                  <Plus aria-hidden="true" size={18} />
                  新增{activeDefinition.label}
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
