"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  // Use the light theme by default if the system theme is not set
  const { theme = "light" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      style={
        {
          "--normal-bg": "#fff", // Or use `var(--popover)` if you're keeping it dynamic
          "--normal-text": "#1A73E8", // ← this is your pfebrand color
          "--normal-border": "#1A73E8",
          "--normal-description": "#6B7280", // Add this line to customize description color
        } as React.CSSProperties
      }
      duration={10000} // 10 seconds (I fixed the extremely long duration)
      
      {...props}
    />
  )
}

export { Toaster }