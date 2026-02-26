import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface StatCardProps {
	title: string;
	value: string;
	unit?: string;
	description?: string;
	icon: LucideIcon;
	trend?: {
		value: number;
		isPositive: boolean;
	};
	className?: string;
}

function StatCard({
	title,
	value,
	unit,
	description,
	icon: Icon,
	trend,
	className,
}: StatCardProps) {
	return (
		<Card className={cn("transition-shadow hover:shadow-md", className)}>
			<CardHeader className="flex flex-row items-center justify-between pb-2">
				<CardTitle className="text-sm font-medium text-muted-foreground">
					{title}
				</CardTitle>
				<Icon className="size-4 text-muted-foreground" />
			</CardHeader>
			<CardContent>
				<div className="flex items-baseline gap-1">
					<span className="text-2xl font-bold">{value}</span>
					{unit && (
						<span className="text-sm text-muted-foreground">{unit}</span>
					)}
				</div>
				{(description || trend) && (
					<p className="mt-1 text-xs text-muted-foreground">
						{trend && (
							<span
								className={cn(
									"font-medium",
									trend.isPositive ? "text-green-500" : "text-red-500",
								)}
							>
								{trend.isPositive ? "↑" : "↓"}{" "}
								{Math.abs(trend.value).toFixed(1)}%{" "}
							</span>
						)}
						{description}
					</p>
				)}
			</CardContent>
		</Card>
	);
}

export { StatCard };
export type { StatCardProps };
