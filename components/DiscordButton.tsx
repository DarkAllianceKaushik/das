import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

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

  return (
    <Button
      variant="secondary"
      size={size === "sm" ? "sm" : "default"}
      className={`rounded-xl border border-[#5865F2]/40 bg-[#5865F2]/20 text-white shadow-glass-sm backdrop-blur-[16px] hover:bg-[#5865F2]/30 ${className}`}
      render={<a href={discordUrl} target="_blank" rel="noopener noreferrer" />}
    >
      <MessageCircle className={size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4"} />
      Join our Discord
    </Button>
  );
}
