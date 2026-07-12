import { cn } from "@/src/lib/utils";

type RippleDecorationProps = {
  className?: string;
  tone?: "brand" | "light";
};

export function RippleDecoration({
  className,
  tone = "brand",
}: RippleDecorationProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "ripple-decoration",
        tone === "light" && "ripple-decoration-light",
        className,
      )}
    >
      <span />
      <span />
      <span />
    </span>
  );
}
