import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-9 w-full min-w-0 rounded-xl border border-glass-border bg-glass-darker/50 px-3 py-1.5 text-sm text-white transition-all duration-300 outline-none placeholder:text-glass-muted file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-white",
        "focus-visible:border-glass-accent/50 focus-visible:shadow-lg focus-visible:shadow-glass-accent/10",
        "hover:border-glass-border/80",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:border-destructive aria-invalid:shadow-lg aria-invalid:shadow-destructive/10",
        className
      )}
      {...props}
    />
  )
}

export { Input }
