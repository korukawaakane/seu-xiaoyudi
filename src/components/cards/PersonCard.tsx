import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Person } from "@/src/types";
import { ImagePlaceholder } from "@/src/components/ui/ImagePlaceholder";
import { Tag } from "@/src/components/ui/Tag";

type PersonCardProps = {
  person: Person;
  projectTitle?: string;
};

export function PersonCard({ person, projectTitle }: PersonCardProps) {
  return (
    <article className="card group">
      <ImagePlaceholder
        alt={`${person.name}照片占位`}
        className="aspect-[3/4] min-h-0 transition duration-300 group-hover:-translate-y-1"
        label={person.category}
        type="person"
      />
      <div className="mt-5 flex flex-wrap gap-2">
        {person.keywords.map((keyword) => (
          <Tag key={keyword} tone="bronze">
            {keyword}
          </Tag>
        ))}
      </div>
      <h2 className="mt-4 font-serif text-xl font-semibold text-ink">{person.name}</h2>
      <p className="mt-1 text-sm text-muted">{person.years}</p>
      <p className="mt-3 text-sm leading-7 text-muted">{person.summary}</p>
      {projectTitle ? (
        <p className="mt-4 text-xs font-medium text-muted">所属项目：{projectTitle}</p>
      ) : null}
      <Link className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand" href={`/people/${person.slug}`}>
        查看详情
        <ArrowRight aria-hidden="true" size={16} />
      </Link>
    </article>
  );
}
