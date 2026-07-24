"use client"

import * as React from "react"
import { useCallback } from "react"
import { Button as ButtonPrimitive } from "@base-ui/react/button"

import { cn } from "@/lib/utils"

function Button({
  className,
  variant = "default",
  size = "default",
  magnetic,
  ...props
}: ButtonPrimitive.Props & {
  variant?: "default" | "outline" | "secondary" | "ghost" | "destructive" | "link"
  size?: "default" | "xs" | "sm" | "lg" | "icon" | "icon-xs" | "icon-sm" | "icon-lg"
  magnetic?: boolean
}) {
  const ref = React.useRef<HTMLButtonElement>(null);

  const handleMove = useCallback((e: React.MouseEvent) => {
    const el = ref.current;
    if (!el || !magnetic) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    el.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
  }, [magnetic]);

  const handleLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "";
  }, []);

  return (
    <ButtonPrimitive
      ref={ref}
      data-slot="button"
      onMouseMove={magnetic ? handleMove : undefined}
      onMouseLeave={magnetic ? handleLeave : undefined}
      style={{ transition: "transform 0.15s ease-out" }}
      className={cn(
        "group/btn relative inline-flex shrink-0 items-center justify-center overflow-hidden font-medium whitespace-nowrap transition-all duration-300 outline-none select-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        // Sizes
        size === "default" && "h-9 gap-1.5 rounded-xl px-4 text-sm",
        size === "xs" && "h-6 gap-1 rounded-lg px-2 text-xs",
        size === "sm" && "h-7 gap-1 rounded-lg px-2.5 text-[0.8rem]",
        size === "lg" && "h-10 gap-2 rounded-xl px-5 text-sm",
        size === "icon" && "size-9 rounded-xl",
        size === "icon-xs" && "size-6 rounded-lg",
        size === "icon-sm" && "size-7 rounded-lg",
        size === "icon-lg" && "size-10 rounded-xl",
        // Variants
        variant === "default" &&
          "bg-gradient-to-br from-glass-accent via-glass-accent-dim to-glass-accent text-white shadow-lg shadow-glass-accent/25 before:absolute before:inset-0 before:-z-10 before:translate-x-[-100%] before:bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent)] before:transition-transform before:duration-500 hover:before:translate-x-[100%] hover:shadow-glass-accent/40 active:shadow-none",
        variant === "outline" &&
          "border border-glass-border bg-glass-card/50 text-white backdrop-blur-sm hover:bg-glass-dark/50 hover:border-glass-accent/50 hover:shadow-lg hover:shadow-glass-accent/10",
        variant === "secondary" &&
          "bg-glass-dark text-white hover:bg-glass-card border border-glass-border",
        variant === "ghost" &&
          "text-muted-foreground hover:text-white hover:bg-glass-card/50",
        variant === "destructive" &&
          "bg-destructive/10 text-destructive hover:bg-destructive/20 border border-destructive/20",
        variant === "link" &&
          "text-glass-accent underline-offset-4 hover:underline",
        className
      )}
      {...props}
    />
  )
}

function buttonVariants({
  variant = "default",
  size = "default",
  className,
}: {
  variant?: "default" | "outline" | "secondary" | "ghost" | "destructive" | "link"
  size?: "default" | "xs" | "sm" | "lg" | "icon" | "icon-xs" | "icon-sm" | "icon-lg"
  className?: string
} = {}) {
  return cn(
    "group/btn relative inline-flex shrink-0 items-center justify-center overflow-hidden font-medium whitespace-nowrap transition-all duration-300 outline-none select-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    // Sizes
    size === "default" && "h-9 gap-1.5 rounded-xl px-4 text-sm",
    size === "xs" && "h-6 gap-1 rounded-lg px-2 text-xs",
    size === "sm" && "h-7 gap-1 rounded-lg px-2.5 text-[0.8rem]",
    size === "lg" && "h-10 gap-2 rounded-xl px-5 text-sm",
    size === "icon" && "size-9 rounded-xl",
    size === "icon-xs" && "size-6 rounded-lg",
    size === "icon-sm" && "size-7 rounded-lg",
    size === "icon-lg" && "size-10 rounded-xl",
    // Variants
    variant === "default" &&
      "bg-gradient-to-br from-glass-accent via-glass-accent-dim to-glass-accent text-white shadow-lg shadow-glass-accent/25 before:absolute before:inset-0 before:-z-10 before:translate-x-[-100%] before:bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent)] before:transition-transform before:duration-500 hover:before:translate-x-[100%] hover:shadow-glass-accent/40 active:shadow-none",
    variant === "outline" &&
      "border border-glass-border bg-glass-card/50 text-white backdrop-blur-sm hover:bg-glass-dark/50 hover:border-glass-accent/50 hover:shadow-lg hover:shadow-glass-accent/10",
    variant === "secondary" &&
      "bg-glass-dark text-white hover:bg-glass-card border border-glass-border",
    variant === "ghost" &&
      "text-muted-foreground hover:text-white hover:bg-glass-card/50",
    variant === "destructive" &&
      "bg-destructive/10 text-destructive hover:bg-destructive/20 border border-destructive/20",
    variant === "link" &&
      "text-glass-accent underline-offset-4 hover:underline",
    className
  )
}

export { Button, buttonVariants }
