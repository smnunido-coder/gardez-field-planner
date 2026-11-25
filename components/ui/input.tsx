import * as React from "react";
import { cn } from "@/lib/utils";

export const fieldClass =
  "flex h-11 w-full rounded-md border border-input bg-white px-3 text-base text-foreground shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring";

export function Input({ className, ...props }: React.ComponentProps<"input">) {
  return <input className={cn(fieldClass, className)} {...props} />;
}
