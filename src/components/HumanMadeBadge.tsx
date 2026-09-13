function colorFor(score: number): string {
  if (score >= 85) return "from-emerald-400 to-teal-300 text-emerald-950";
  if (score >= 65) return "from-lime-400 to-emerald-300 text-lime-950";
  if (score >= 40) return "from-amber-400 to-yellow-300 text-amber-950";
  if (score >= 20) return "from-orange-400 to-amber-300 text-orange-950";
  return "from-rose-500 to-red-400 text-rose-950";
}

export default function HumanMadeBadge({
  score,
  label,
  size = "md",
}: {
  score: number;
  label: string;
  size?: "sm" | "md" | "lg";
}) {
  const pad =
    size === "lg" ? "px-4 py-2 text-base" : size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r font-bold ${colorFor(
        score,
      )} ${pad}`}
      title={`${score}/100 human-made`}
    >
      <span aria-hidden>♥</span>
      {score}
      <span className="font-semibold opacity-80">· {label}</span>
    </span>
  );
}
