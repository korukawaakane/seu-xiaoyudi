"use client";

import type { AdminCollection, AdminRole } from "@/src/lib/admin-content";
import type {
  Achievement,
  AchievementAssetStatus,
  AchievementType,
  ContentStatus,
  Person,
  Project,
  Semester,
  Story,
  StoryCategory,
} from "@/src/types";
import {
  Field,
  FormSection,
  Input,
  Select,
  Textarea,
} from "@/src/components/admin/AdminFields";

type EditableDocument = Project | Person | Story | Achievement;

type AdminEditorProps = {
  collection: AdminCollection;
  document: EditableDocument;
  onChange: (document: EditableDocument) => void;
  projects: Project[];
  role: AdminRole;
};

const semesters: Semester[] = ["春季学期", "暑期社会实践", "秋季学期"];
const storyCategories: StoryCategory[] = [
  "实践记录",
  "实地走访",
  "采访调研",
  "主题学习",
  "团队活动",
  "志愿服务",
  "成果汇报",
];
const achievementTypes: AchievementType[] = [
  "调研报告",
  "展示文稿",
  "视频作品",
  "宣传海报",
  "摄影作品",
  "实践心得",
  "电子手册",
];
const assetStatuses: AchievementAssetStatus[] = ["整理中", "可预览", "已归档"];

const toCommaText = (values: string[]) => values.join("，");
const fromCommaText = (value: string) =>
  value
    .split(/[,，\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
const toParagraphText = (values: string[]) => values.join("\n\n");
const fromParagraphText = (value: string) =>
  value
    .split(/\n\s*\n/)
    .map((item) => item.trim())
    .filter(Boolean);

function StatusField<Document extends EditableDocument>({
  document,
  onChange,
  role,
}: {
  document: Document;
  onChange: (document: Document) => void;
  role: AdminRole;
}) {
  const statuses: ContentStatus[] = role === "admin"
    ? ["draft", "review", "published", "archived"]
    : ["draft", "review"];

  return (
    <Field label="内容状态" required>
      <Select
        onChange={(value) => onChange({
          ...document,
          status: value as ContentStatus,
        } as Document)}
        value={statuses.includes(document.status) ? document.status : "review"}
      >
        <option value="draft">草稿</option>
        <option value="review">待审核</option>
        {role === "admin" ? <option value="published">已发布</option> : null}
        {role === "admin" ? <option value="archived">已归档</option> : null}
      </Select>
    </Field>
  );
}

function ProjectEditor({
  document,
  onChange,
  role,
}: {
  document: Project;
  onChange: (document: Project) => void;
  role: AdminRole;
}) {
  return (
    <>
      <FormSection title="基本信息">
        <Field label="项目名称" required>
          <Input onChange={(title) => onChange({ ...document, title })} value={document.title} />
        </Field>
        <Field label="网址标识">
          <Input disabled onChange={() => undefined} value={document.slug} />
        </Field>
        <Field label="年份" required>
          <Input
            onChange={(year) => onChange({ ...document, year: Number(year) })}
            type="number"
            value={document.year}
          />
        </Field>
        <Field label="学期" required>
          <Select
            onChange={(semester) => onChange({ ...document, semester: semester as Semester })}
            value={document.semester}
          >
            {semesters.map((semester) => <option key={semester}>{semester}</option>)}
          </Select>
        </Field>
        <Field label="实践地点" required>
          <Input onChange={(location) => onChange({ ...document, location })} value={document.location} />
        </Field>
        <Field label="项目主题" required>
          <Input onChange={(theme) => onChange({ ...document, theme })} value={document.theme} />
        </Field>
        <Field label="项目简介" required wide>
          <Textarea onChange={(summary) => onChange({ ...document, summary })} value={document.summary} />
        </Field>
      </FormSection>

      <FormSection title="项目正文">
        <Field label="实践背景" required wide>
          <Textarea onChange={(background) => onChange({ ...document, background })} rows={7} value={document.background} />
        </Field>
        <Field label="实践目的" required wide>
          <Textarea onChange={(purpose) => onChange({ ...document, purpose })} rows={6} value={document.purpose} />
        </Field>
        <Field label="项目口号">
          <Input onChange={(slogan) => onChange({ ...document, slogan })} value={document.slogan} />
        </Field>
        <Field label="封面图片地址">
          <Input onChange={(coverImage) => onChange({ ...document, coverImage })} value={document.coverImage} />
        </Field>
        <Field label="开始日期">
          <Input onChange={(startDate) => onChange({ ...document, startDate })} type="date" value={document.startDate ?? ""} />
        </Field>
        <Field label="结束日期">
          <Input onChange={(endDate) => onChange({ ...document, endDate })} type="date" value={document.endDate ?? ""} />
        </Field>
      </FormSection>

      <FormSection title="关联与发布">
        <Field label="标签（逗号分隔）">
          <Input onChange={(value) => onChange({ ...document, tags: fromCommaText(value) })} value={toCommaText(document.tags)} />
        </Field>
        <StatusField document={document} onChange={onChange} role={role} />
        <Field label="关联人物 ID">
          <Input onChange={(value) => onChange({ ...document, personIds: fromCommaText(value) })} value={toCommaText(document.personIds)} />
        </Field>
        <Field label="关联纪实 ID">
          <Input onChange={(value) => onChange({ ...document, storyIds: fromCommaText(value) })} value={toCommaText(document.storyIds)} />
        </Field>
        <Field label="关联成果 ID">
          <Input onChange={(value) => onChange({ ...document, achievementIds: fromCommaText(value) })} value={toCommaText(document.achievementIds)} />
        </Field>
        <label className="flex min-h-11 items-center gap-3 self-end rounded-[8px] border border-line bg-paper px-3 py-2 text-sm font-semibold text-ink">
          <input
            checked={document.featured}
            className="h-4 w-4 accent-brand"
            onChange={(event) => onChange({ ...document, featured: event.target.checked })}
            type="checkbox"
          />
          首页推荐
        </label>
      </FormSection>
    </>
  );
}

function PersonEditor({
  document,
  onChange,
  role,
}: {
  document: Person;
  onChange: (document: Person) => void;
  role: AdminRole;
}) {
  return (
    <>
      <FormSection title="基本信息">
        <Field label="姓名" required>
          <Input onChange={(name) => onChange({ ...document, name })} value={document.name} />
        </Field>
        <Field label="网址标识">
          <Input disabled onChange={() => undefined} value={document.slug} />
        </Field>
        <Field label="人物分类" required>
          <Input onChange={(category) => onChange({ ...document, category })} value={document.category} />
        </Field>
        <Field label="生卒或活动年份">
          <Input onChange={(years) => onChange({ ...document, years })} value={document.years} />
        </Field>
        <Field label="籍贯">
          <Input onChange={(birthplace) => onChange({ ...document, birthplace })} value={document.birthplace} />
        </Field>
        <Field label="身份">
          <Input onChange={(identity) => onChange({ ...document, identity })} value={document.identity} />
        </Field>
        <Field label="人物简介" required wide>
          <Textarea onChange={(summary) => onChange({ ...document, summary })} value={document.summary} />
        </Field>
        <Field label="人物正文" required wide>
          <Textarea onChange={(biography) => onChange({ ...document, biography })} rows={9} value={document.biography} />
        </Field>
      </FormSection>

      <FormSection title="关联与发布">
        <Field label="人物照片地址">
          <Input onChange={(portrait) => onChange({ ...document, portrait })} value={document.portrait} />
        </Field>
        <Field label="关键词（逗号分隔）">
          <Input onChange={(value) => onChange({ ...document, keywords: fromCommaText(value) })} value={toCommaText(document.keywords)} />
        </Field>
        <Field label="关联项目 ID">
          <Input onChange={(value) => onChange({ ...document, projectIds: fromCommaText(value) })} value={toCommaText(document.projectIds)} />
        </Field>
        <Field label="关联纪实 ID">
          <Input onChange={(value) => onChange({ ...document, storyIds: fromCommaText(value) })} value={toCommaText(document.storyIds)} />
        </Field>
        <Field label="主要事迹（每段空一行）" wide>
          <Textarea onChange={(value) => onChange({ ...document, deeds: fromParagraphText(value) })} rows={7} value={toParagraphText(document.deeds)} />
        </Field>
        <StatusField document={document} onChange={onChange} role={role} />
      </FormSection>
    </>
  );
}

function StoryEditor({
  document,
  onChange,
  projects,
  role,
}: {
  document: Story;
  onChange: (document: Story) => void;
  projects: Project[];
  role: AdminRole;
}) {
  return (
    <>
      <FormSection title="基本信息">
        <Field label="文章标题" required>
          <Input onChange={(title) => onChange({ ...document, title })} value={document.title} />
        </Field>
        <Field label="网址标识">
          <Input disabled onChange={() => undefined} value={document.slug} />
        </Field>
        <Field label="发布日期" required>
          <Input onChange={(date) => onChange({ ...document, date })} type="date" value={document.date} />
        </Field>
        <Field label="文章分类" required>
          <Select
            onChange={(category) => onChange({ ...document, category: category as StoryCategory })}
            value={document.category}
          >
            {storyCategories.map((category) => <option key={category}>{category}</option>)}
          </Select>
        </Field>
        <Field label="所属项目" required>
          <Select onChange={(projectId) => onChange({ ...document, projectId })} value={document.projectId}>
            <option value="">请选择项目</option>
            {projects.map((project) => <option key={project.id} value={project.id}>{project.title}</option>)}
          </Select>
        </Field>
        <Field label="作者或整理人员" required>
          <Input onChange={(author) => onChange({ ...document, author })} value={document.author} />
        </Field>
        <Field label="文章摘要" required wide>
          <Textarea onChange={(summary) => onChange({ ...document, summary })} value={document.summary} />
        </Field>
      </FormSection>

      <FormSection title="正文与发布">
        <Field label="正文（每段空一行）" required wide>
          <Textarea onChange={(value) => onChange({ ...document, content: fromParagraphText(value) })} rows={16} value={toParagraphText(document.content)} />
        </Field>
        <Field label="封面图片地址">
          <Input onChange={(coverImage) => onChange({ ...document, coverImage })} value={document.coverImage} />
        </Field>
        <Field label="标签（逗号分隔）">
          <Input onChange={(value) => onChange({ ...document, tags: fromCommaText(value) })} value={toCommaText(document.tags)} />
        </Field>
        <StatusField document={document} onChange={onChange} role={role} />
        <label className="flex min-h-11 items-center gap-3 self-end rounded-[8px] border border-line bg-paper px-3 py-2 text-sm font-semibold text-ink">
          <input
            checked={document.featured}
            className="h-4 w-4 accent-brand"
            onChange={(event) => onChange({ ...document, featured: event.target.checked })}
            type="checkbox"
          />
          推荐文章
        </label>
      </FormSection>
    </>
  );
}

function AchievementEditor({
  document,
  onChange,
  projects,
  role,
}: {
  document: Achievement;
  onChange: (document: Achievement) => void;
  projects: Project[];
  role: AdminRole;
}) {
  return (
    <>
      <FormSection title="基本信息">
        <Field label="成果名称" required>
          <Input onChange={(title) => onChange({ ...document, title })} value={document.title} />
        </Field>
        <Field label="网址标识">
          <Input disabled onChange={() => undefined} value={document.slug} />
        </Field>
        <Field label="成果类型" required>
          <Select
            onChange={(type) => onChange({ ...document, type: type as AchievementType })}
            value={document.type}
          >
            {achievementTypes.map((type) => <option key={type}>{type}</option>)}
          </Select>
        </Field>
        <Field label="所属项目" required>
          <Select onChange={(projectId) => onChange({ ...document, projectId })} value={document.projectId}>
            <option value="">请选择项目</option>
            {projects.map((project) => <option key={project.id} value={project.id}>{project.title}</option>)}
          </Select>
        </Field>
        <Field label="发布日期" required>
          <Input onChange={(publishDate) => onChange({ ...document, publishDate })} type="date" value={document.publishDate} />
        </Field>
        <Field label="制作人员（逗号分隔）">
          <Input onChange={(value) => onChange({ ...document, creators: fromCommaText(value) })} value={toCommaText(document.creators)} />
        </Field>
        <Field label="成果摘要" required wide>
          <Textarea onChange={(summary) => onChange({ ...document, summary })} value={document.summary} />
        </Field>
      </FormSection>

      <FormSection title="文件与发布">
        <Field label="封面图片地址">
          <Input onChange={(coverImage) => onChange({ ...document, coverImage })} value={document.coverImage ?? ""} />
        </Field>
        <Field label="资料归档状态">
          <Select
            onChange={(assetStatus) => onChange({ ...document, assetStatus: assetStatus as AchievementAssetStatus })}
            value={document.assetStatus}
          >
            {assetStatuses.map((status) => <option key={status}>{status}</option>)}
          </Select>
        </Field>
        <Field label="在线预览地址">
          <Input onChange={(previewUrl) => onChange({ ...document, previewUrl: previewUrl || null })} type="url" value={document.previewUrl ?? ""} />
        </Field>
        <Field label="文件下载地址">
          <Input onChange={(fileUrl) => onChange({ ...document, fileUrl: fileUrl || null })} type="url" value={document.fileUrl ?? ""} />
        </Field>
        <StatusField document={document} onChange={onChange} role={role} />
      </FormSection>
    </>
  );
}

export function AdminEditor({
  collection,
  document,
  onChange,
  projects,
  role,
}: AdminEditorProps) {
  if (collection === "projects") {
    return <ProjectEditor document={document as Project} onChange={onChange} role={role} />;
  }
  if (collection === "people") {
    return <PersonEditor document={document as Person} onChange={onChange} role={role} />;
  }
  if (collection === "stories") {
    return <StoryEditor document={document as Story} onChange={onChange} projects={projects} role={role} />;
  }
  return <AchievementEditor document={document as Achievement} onChange={onChange} projects={projects} role={role} />;
}
