"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cn } from "@/lib/utils"

const CircularProgress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & {
    size?: "sm" | "default" | "lg";
    showValue?: boolean;
  }
>(({ className, value = 0, size = "default", showValue = false, ...props }, ref) => {
  const sizeStyles = {
    sm: "h-4 w-4",
    default: "h-8 w-8",
    lg: "h-12 w-12"
  }

  const radius = size === "sm" ? 6 : size === "default" ? 14 : 22
  const circumference = 2 * Math.PI * radius
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (value / 100) * circumference

  return (
    <div className="relative inline-flex items-center justify-center">
      <ProgressPrimitive.Root
        ref={ref}
        className={cn(
          "relative transform -rotate-90",
          sizeStyles[size],
          className
        )}
        {...props}
        value={value}
      >
        <svg className="h-full w-full">
          {/* Background circle */}
          <circle
            className="text-muted stroke-current"
            strokeWidth="2"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="50%"
            cy="50%"
          />
          {/* Progress circle */}
          <circle
            className="text-primary stroke-current transition-all duration-300 ease-in-out"
            strokeWidth="2"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="50%"
            cy="50%"
          />
        </svg>
      </ProgressPrimitive.Root>
      {showValue && (
        <div className="absolute inset-0 flex items-center justify-center text-xs font-medium">
          {Math.round(value)}%
        </div>
      )}
    </div>
  )
})
CircularProgress.displayName = ProgressPrimitive.Root.displayName

export { CircularProgress } 