import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "ts-btn whitespace-nowrap transition-opacity hover:opacity-90 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "ts-btn--primary",
        cta: "ts-btn--cta",
        destructive: "ts-btn--danger",
        outline: "ts-btn--secondary",
        secondary: "ts-btn--secondary",
        ghost: "ts-btn--ghost hover:bg-primary/5",
        link: "bg-transparent text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "",
        sm: "ts-btn--sm",
        lg: "min-h-11 px-8",
        icon: "h-10 w-10 p-0",
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