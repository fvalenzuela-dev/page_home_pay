import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/utils";

const iconActionButtonVariants = cva(
	"inline-flex size-11 cursor-pointer items-center justify-center rounded-full border font-extrabold transition-[background-color,border-color,box-shadow,transform] duration-150 hover:-translate-y-px focus-visible:-translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-60",
	{
		variants: {
			variant: {
				neutral:
					"border-border bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground focus-visible:outline-ring",
				"primary-soft":
					"border-primary/40 bg-primary/15 text-primary hover:bg-primary/25 focus-visible:outline-ring",
				"danger-soft":
					"border-destructive/40 bg-destructive/40 text-destructive hover:bg-destructive/50 focus-visible:outline-destructive",
			},
		},
		defaultVariants: {
			variant: "neutral",
		},
	},
);

export interface IconActionButtonProps
	extends ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof iconActionButtonVariants> {
	icon: ReactNode;
	"aria-label": string;
}

export { iconActionButtonVariants };

export default function IconActionButton({
	className,
	icon,
	type = "button",
	variant,
	...props
}: IconActionButtonProps) {
	return (
		<button
			className={cn(iconActionButtonVariants({ variant }), className)}
			type={type}
			{...props}
		>
			<span aria-hidden="true" className="pointer-events-none">
				{icon}
			</span>
		</button>
	);
}
