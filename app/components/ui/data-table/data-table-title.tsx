import type { ReactNode } from "react";

interface DataTableTitleProps {
	eyebrow?: ReactNode;
	title?: ReactNode;
}

export function DataTableTitle({ eyebrow, title }: DataTableTitleProps) {
	if (eyebrow == null && title == null) {
		return null;
	}

	return (
		<div className="mb-6 flex items-center justify-between gap-4 max-[560px]:grid max-[560px]:grid-cols-1">
			<div>
				{eyebrow != null && (
					<p className="text-xs leading-4 font-semibold tracking-[0.08em] text-[var(--on-surface-variant)] uppercase">
						{eyebrow}
					</p>
				)}
				{title != null && (
					<h2 className="mt-2 font-['Manrope',Inter,ui-sans-serif,system-ui,sans-serif] text-[clamp(1.5rem,3vw,2rem)] leading-[1.15] tracking-[-0.02em]">
						{title}
					</h2>
				)}
			</div>
		</div>
	);
}
