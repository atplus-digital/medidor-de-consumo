import type { ComponentType } from "react";

function ReadingItem({
	icon: Icon,
	label,
	value,
	unit,
}: {
	icon: ComponentType<{ className?: string }>;
	label: string;
	value: string;
	unit: string;
}) {
	return (
		<div className="flex items-center gap-3 rounded-lg border bg-card p-3">
			<div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
				<Icon className="size-5 text-primary" />
			</div>
			<div className="min-w-0 flex-1">
				<p className="text-xs text-muted-foreground">{label}</p>
				<p className="truncate text-lg font-semibold">
					{value} <span className="text-xs text-muted-foreground">{unit}</span>
				</p>
			</div>
		</div>
	);
}

export { ReadingItem };
