import { cn } from "@/src/lib/utils";

type WaterDropMarkProps = {
  className?: string;
  tone?: "light" | "dark";
};

export function WaterDropMark({ className, tone = "light" }: WaterDropMarkProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "waterdrop-mark",
        tone === "dark" && "waterdrop-mark-dark",
        className,
      )}
    >
      <span className="waterdrop-mark-core" />
      <span className="waterdrop-mark-ripple waterdrop-mark-ripple-one" />
      <span className="waterdrop-mark-ripple waterdrop-mark-ripple-two" />
    </span>
  );
}
