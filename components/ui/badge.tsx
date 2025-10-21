import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[--brand-primary] text-white hover:opacity-90",
        secondary:
          "border-transparent bg-[--surface-alt] text-[--ink] hover:bg-[--surface-alt]/80",
        success:
          "border-transparent bg-[--success] text-white",
        warning:
          "border-transparent bg-[--warning] text-white",
        destructive:
          "border-transparent bg-[--danger] text-white hover:opacity-90",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
