"use client";

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

  return (
    <a
      href={discordUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`btn-secondary !border-[#5865F2]/40 !bg-[#5865F2]/20 text-white shadow-glass-sm backdrop-blur-[16px] hover:!bg-[#5865F2]/30 ${size === "sm" ? "btn-sm" : ""} ${className}`}
    >
      <MessageCircle className={size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4"} />
      Join our Discord
    </a>
  );
}
