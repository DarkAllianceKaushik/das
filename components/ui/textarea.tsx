import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-16 w-full rounded-xl border border-glass-border bg-glass-darker/50 px-3 py-2 text-sm text-white transition-all duration-300 outline-none placeholder:text-glass-muted",
        "focus-visible:border-glass-accent/50 focus-visible:shadow-lg focus-visible:shadow-glass-accent/10",
        "hover:border-glass-border/80",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:border-destructive aria-invalid:shadow-lg aria-invalid:shadow-destructive/10",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
