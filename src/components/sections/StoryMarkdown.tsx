import Image from "next/image";
import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";

type StoryMarkdownProps = {
  blocks: string[];
};

const components: Components = {
  h1: ({ children }) => (
    <h2 className="mt-10 font-serif text-3xl font-semibold leading-snug text-ink first:mt-0">
      {children}
    </h2>
  ),
  h2: ({ children }) => (
    <h3 className="mt-8 font-serif text-2xl font-semibold leading-snug text-ink">{children}</h3>
  ),
  h3: ({ children }) => (
    <h4 className="mt-6 font-serif text-xl font-semibold leading-snug text-ink">{children}</h4>
  ),
  p: ({ children }) => <p>{children}</p>,
  ul: ({ children }) => <ul className="my-5 list-disc space-y-2 pl-6 marker:text-accent">{children}</ul>,
  ol: ({ children }) => <ol className="my-5 list-decimal space-y-2 pl-6 marker:text-accent">{children}</ol>,
  blockquote: ({ children }) => <blockquote className="quote-panel my-7">{children}</blockquote>,
  a: ({ children, href }) => (
    <a className="text-accent underline decoration-accent/40 underline-offset-4" href={href}>
      {children}
    </a>
  ),
  img: ({ src, alt }) => {
    if (typeof src !== "string" || !src.startsWith("/")) return null;

    return (
      <Image
        alt={alt ?? ""}
        className="my-7 h-auto w-full border border-line bg-paper"
        height={800}
        sizes="(min-width: 1024px) 46rem, 100vw"
        src={src}
        width={1200}
      />
    );
  },
};

export function StoryMarkdown({ blocks }: StoryMarkdownProps) {
  return (
    <div className="story-markdown">
      {blocks.map((block, index) => (
        <ReactMarkdown components={components} key={`${index}-${block.slice(0, 32)}`}>
          {block}
        </ReactMarkdown>
      ))}
    </div>
  );
}
