import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-mono font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 uppercase tracking-wider",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 hover:shadow-xl border border-primary/20",
        destructive:
          "bg-destructive text-destructive-foreground shadow-lg hover:bg-destructive/90 border border-destructive/20",
        outline:
          "border border-primary bg-background/10 backdrop-blur-sm text-foreground shadow-lg hover:bg-primary hover:text-primary-foreground hover:shadow-xl hover-glitch",
        secondary:
          "bg-secondary text-secondary-foreground shadow-lg hover:bg-secondary/80 border border-secondary/20",
        ghost: "hover:bg-accent hover:text-accent-foreground hover-glitch",
        link: "text-primary underline-offset-4 hover:underline hover-glitch",
        cyber: "bg-primary text-primary-foreground shadow-lg border border-primary/30 cyber-glow hover:scale-105 hover-glitch font-bold",
        terminal: "bg-background border border-primary text-primary font-mono shadow-lg hover:bg-primary hover:text-primary-foreground hover:shadow-xl hover-glitch",
      },
      size: {
        default: "h-12 px-6 py-3 rounded-sm",
        sm: "h-9 px-4 py-2 rounded-sm text-xs",
        lg: "h-14 px-8 py-4 rounded-sm text-lg",
        xl: "h-16 px-12 py-5 rounded-sm text-xl",
        icon: "h-12 w-12 rounded-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
