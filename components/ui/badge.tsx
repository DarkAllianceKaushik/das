import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-all duration-300",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-br from-glass-accent via-glass-accent-dim to-glass-accent text-white shadow-sm shadow-glass-accent/20",
        secondary:
          "bg-glass-dark text-white border border-glass-border",
        destructive:
          "bg-destructive/15 text-destructive border border-destructive/20",
        outline:
          "border border-glass-border text-glass-muted hover:text-white hover:border-glass-accent/30",
        ghost:
          "text-glass-muted hover:text-white hover:bg-glass-card/50",
        link:
          "text-glass-accent underline-offset-4 hover:underline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
