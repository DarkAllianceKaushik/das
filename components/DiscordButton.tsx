import { MessageCircle } from "lucide-react";

interface DiscordButtonProps {
  discordUrl: string;
  className?: string;
  size?: "sm" | "md";
}

export function DiscordButton({
  discordUrl,
  className = "",
  size = "md",
}: DiscordButtonProps) {
  if (!discordUrl) return null;

  const sizeClasses =
    size === "sm"
      ? "px-3 py-1.5 text-xs gap-1.5"
      : "px-5 py-2.5 text-sm gap-2";

  return (
    <a
      href={discordUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center rounded-lg bg-[#5865F2] font-semibold text-white transition hover:bg-[#4752C4] focus:outline-none focus:ring-2 focus:ring-[#5865F2] focus:ring-offset-2 focus:ring-offset-alliance-black ${sizeClasses} ${className}`}
    >
      <MessageCircle className={size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4"} />
      Join our Discord
    </a>
  );
}
