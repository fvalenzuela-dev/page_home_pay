import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
	"inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-2xl font-extrabold transition-[background-color,border-color,box-shadow,transform] duration-150 focus-visible:-translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-60",
	{
		variants: {
			variant: {
				primary:
					"border border-primary bg-primary text-primary-foreground shadow-primary hover:-translate-y-px hover:bg-primary-hover hover:shadow-primary-lg focus-visible:outline-ring",
				secondary:
					"border border-secondary bg-secondary text-secondary-foreground hover:-translate-y-px hover:bg-secondary-hover focus-visible:outline-ring",
				warning:
					"border border-warning bg-warning text-warning-foreground hover:-translate-y-px hover:bg-warning-hover focus-visible:outline-warning-focus",
				outline:
					"border border-border bg-transparent text-foreground hover:-translate-y-px hover:bg-accent hover:text-accent-foreground focus-visible:outline-ring",
				ghost:
					"border border-transparent bg-transparent text-accent-foreground hover:bg-accent focus-visible:outline-ring",
				danger:
					"border border-destructive bg-destructive text-destructive-foreground shadow-destructive hover:bg-destructive-hover focus-visible:outline-destructive",
				link: "border border-transparent bg-transparent p-0 text-primary underline-offset-4 hover:underline focus-visible:outline-ring",
			},
			size: {
				sm: "min-h-9 px-3 py-2 text-xs",
				md: "min-h-11 px-4 py-2.5 text-sm",
				lg: "min-h-12 px-4 py-3",
				icon: "size-11 p-0",
			},
		},
		defaultVariants: {
			variant: "primary",
			size: "lg",
		},
	},
);

export interface ButtonProps
	extends ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	asChild?: boolean;
}

export { buttonVariants };

export default function Button({
	asChild = false,
	className,
	size,
	type = "button",
	variant,
	...props
}: ButtonProps) {
	const Comp = asChild ? Slot : "button";

	return (
		<Comp
			className={cn(buttonVariants({ size, variant }), className)}
			{...(!asChild ? { type } : {})}
			{...props}
		/>
	);
}
