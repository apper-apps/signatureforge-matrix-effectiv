import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Badge = forwardRef(({ className, variant = "default", children, ...props }, ref) => {
  const variants = {
    default: "bg-gray-100 text-gray-800",
    primary: "bg-gradient-to-r from-primary-100 to-primary-200 text-primary-800",
    secondary: "bg-gradient-to-r from-secondary-100 to-secondary-200 text-secondary-800",
    success: "bg-gradient-to-r from-accent-100 to-accent-200 text-accent-800",
    warning: "bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800",
    error: "bg-gradient-to-r from-red-100 to-red-200 text-red-800"
  };

  return (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = "Badge";

export default Badge;