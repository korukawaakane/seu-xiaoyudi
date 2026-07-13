type CmsEntry = Record<string, unknown>;

/**
 * Decap CMS 的表单分区标题不属于内容模型。即使后台将其作为空值写入 JSON，
 * 前台数据层也只会接收与 TypeScript 模型一致的字段。
 */
export function loadCmsCollection<T extends CmsEntry>(modules: Record<string, T>): T[] {
  return Object.entries(modules)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([, entry]) =>
      Object.fromEntries(
        Object.entries(entry).filter(([key]) => !key.endsWith("Section")),
      ) as T,
    );
}
