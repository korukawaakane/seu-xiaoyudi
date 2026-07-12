import type { SourceItem } from "@/src/types";
import { EmptyState } from "@/src/components/ui/EmptyState";

type SourceListProps = {
  sources?: SourceItem[];
};

export function SourceList({ sources }: SourceListProps) {
  if (!sources?.length) {
    return (
      <EmptyState
        title="资料来源待补充"
        description="当前占位数据暂未添加资料来源，后续录入真实资料时可在数据文件中补齐。"
      />
    );
  }

  return (
    <ul className="grid gap-3">
      {sources.map((source) => (
        <li className="rounded-[8px] border border-line bg-white p-4" key={source.label}>
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-semibold text-ink">{source.label}</p>
            {source.type ? <span className="text-xs font-medium text-muted">{source.type}</span> : null}
          </div>
          <p className="mt-1 text-sm leading-7 text-muted">{source.description}</p>
          {source.url ? (
            <a className="mt-2 inline-flex text-sm font-medium text-brand" href={source.url} rel="noreferrer" target="_blank">
              查看来源
            </a>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
