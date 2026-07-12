import type { Project } from "@/src/types";

const commonSources = [
  {
    label: "资料来源占位",
    description: "后续用于说明图片、文字与成果材料的整理来源。",
  },
  {
    label: "整理说明占位",
    description: "当前为网站结构演示数据，不代表真实实践资料。",
  },
];

export const projects: Project[] = [
  {
    id: "project-summer-placeholder",
    slug: "summer-practice-placeholder",
    title: "实践项目一",
    year: 2026,
    semester: "暑期社会实践",
    startDate: "2026-07-01",
    endDate: "2026-07-14",
    location: "实践地点占位",
    theme: "主题方向占位",
    summary:
      "用于展示当前推荐实践项目的占位简介，后续可替换为真实项目概况。",
    background:
      "这里用于填写本期实践的背景说明，包括选题来源、调研对象和前期准备情况。",
    purpose:
      "这里用于填写实践目的，说明团队希望通过走访、调研和整理形成的阶段性成果。",
    slogan: "项目宣传语占位",
    featured: true,
    status: "published",
    themeColor: "#8C1D1D",
    personIds: ["person-jia", "person-yi", "person-bing"],
    storyIds: ["story-walk", "story-interview", "story-study"],
    achievementIds: ["achievement-report", "achievement-slides"],
    timeline: [
      {
        date: "前期准备",
        title: "确定实践主题",
        description: "整理资料清单、分工安排和走访计划。",
      },
      {
        date: "实践中期",
        title: "开展走访记录",
        description: "围绕项目主题进行访谈、观察和影像记录。",
      },
      {
        date: "成果整理",
        title: "形成阶段材料",
        description: "归档纪实文章、影像资料和成果文件占位。",
      },
    ],
    gallery: [
      {
        id: "gallery-summer-1",
        title: "实地走访",
        category: "实地走访",
        alt: "实地走访占位图",
        type: "gallery",
      },
      {
        id: "gallery-summer-2",
        title: "团队活动",
        category: "团队活动",
        alt: "团队活动占位图",
        type: "gallery",
      },
      {
        id: "gallery-summer-3",
        title: "成果汇报",
        category: "成果汇报",
        alt: "成果汇报占位图",
        type: "gallery",
      },
    ],
    team: [
      {
        id: "team-a",
        name: "成员占位甲",
        role: "资料整理",
        description: "负责整理文字材料与访谈提纲。",
      },
      {
        id: "team-b",
        name: "成员占位乙",
        role: "影像记录",
        description: "负责拍摄、编号和归档影像资料。",
      },
      {
        id: "team-c",
        name: "成员占位丙",
        role: "成果汇总",
        description: "负责成果目录与展示材料汇总。",
      },
    ],
    reflections: [
      "这里用于填写团队成员对实践过程的阶段性感悟。",
      "这里用于记录项目结束后的总结与后续整理方向。",
    ],
    sources: commonSources,
  },
  {
    id: "project-autumn-placeholder",
    slug: "autumn-practice-placeholder",
    title: "实践项目二",
    year: 2025,
    semester: "秋季学期",
    startDate: "2025-10-08",
    endDate: "2025-10-30",
    location: "实践地点占位",
    theme: "档案整理占位",
    summary:
      "用于展示往届实践项目的占位简介，体现按年份和学期持续归档的结构。",
    background: "这里用于填写往届项目的背景与资料整理范围。",
    purpose: "这里用于填写往届项目的实践目的与成果形式。",
    slogan: "持续记录，点滴成档",
    featured: false,
    status: "archived",
    themeColor: "#A67C52",
    personIds: ["person-ding", "person-wu"],
    storyIds: ["story-service", "story-report"],
    achievementIds: ["achievement-video", "achievement-poster"],
    timeline: [
      {
        date: "资料梳理",
        title: "建立材料目录",
        description: "根据实践阶段整理文字、图片和成果条目。",
      },
      {
        date: "集中归档",
        title: "归并项目资料",
        description: "将人物、纪实和成果与项目建立关联。",
      },
    ],
    gallery: [
      {
        id: "gallery-autumn-1",
        title: "学习讨论",
        category: "学习讨论",
        alt: "学习讨论占位图",
        type: "gallery",
      },
      {
        id: "gallery-autumn-2",
        title: "场馆参观",
        category: "场馆参观",
        alt: "场馆参观占位图",
        type: "gallery",
      },
    ],
    team: [
      {
        id: "team-d",
        name: "成员占位丁",
        role: "项目联络",
        description: "负责实践安排与材料交接。",
      },
      {
        id: "team-e",
        name: "成员占位戊",
        role: "页面维护",
        description: "负责后续数据录入与页面检查。",
      },
    ],
    reflections: ["这里用于补充往届实践的团队总结占位。"],
    sources: commonSources,
  },
  {
    id: "project-spring-placeholder",
    slug: "spring-practice-placeholder",
    title: "实践项目三",
    year: 2024,
    semester: "春季学期",
    startDate: "2024-03-12",
    endDate: "2024-04-05",
    location: "实践地点占位",
    theme: "主题学习占位",
    summary:
      "用于展示更早期实践项目的占位简介，验证长期归档与统一模板能力。",
    background: "这里用于填写早期实践项目的背景说明。",
    purpose: "这里用于填写早期实践项目的目标与记录重点。",
    slogan: "记录实践足迹",
    featured: false,
    status: "archived",
    themeColor: "#8C1D1D",
    personIds: ["person-ji"],
    storyIds: ["story-volunteer"],
    achievementIds: ["achievement-photo", "achievement-handbook"],
    timeline: [
      {
        date: "项目启动",
        title: "明确学习主题",
        description: "完成主题学习计划和资料收集安排。",
      },
      {
        date: "项目收束",
        title: "完成成果归档",
        description: "形成可供后续维护的项目档案条目。",
      },
    ],
    gallery: [
      {
        id: "gallery-spring-1",
        title: "采访调研",
        category: "采访调研",
        alt: "采访调研占位图",
        type: "gallery",
      },
      {
        id: "gallery-spring-2",
        title: "资料整理",
        category: "资料整理",
        alt: "资料整理占位图",
        type: "gallery",
      },
    ],
    team: [
      {
        id: "team-f",
        name: "成员占位己",
        role: "记录整理",
        description: "负责记录实践过程和归档说明。",
      },
    ],
    reflections: ["这里用于填写早期项目的实践感悟占位。"],
    sources: commonSources,
  },
];
