import * as React from "react"
import { cn } from "../lib/utils"

export function Card({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("bg-card rounded-[20px] shadow-[0_2px_15px_rgba(0,0,0,0.03)] border border-sage-light/60 overflow-hidden", className)} {...props}>
      {children}
    </div>
  )
}
