import type { TimelineItem } from "@/src/types";
import { EmptyState } from "@/src/components/ui/EmptyState";

type TimelineProps = {
  items: TimelineItem[];
};

export function Timeline({ items }: TimelineProps) {
  if (!items.length) {
    return (
      <EmptyState
        title="时间线待补充"
        description="当前占位数据暂未录入时间线，后续可在对应数据文件中添加。"
      />
    );
  }

  return (
    <ol className="relative grid gap-4 border-l border-line pl-5">
      {items.map((item) => (
        <li className="relative rounded-[8px] border border-line bg-white p-5 shadow-soft" key={`${item.date}-${item.title}`}>
          <span className="absolute -left-[29px] top-6 h-4 w-4 rounded-full border-2 border-paper bg-brand" />
          <p className="text-sm font-semibold text-brand">{item.date}</p>
          <h3 className="mt-2 font-serif text-xl font-semibold text-ink">{item.title}</h3>
          <p className="mt-2 text-sm leading-7 text-muted">{item.description}</p>
        </li>
      ))}
    </ol>
  );
}
