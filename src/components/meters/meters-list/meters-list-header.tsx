import { Button } from "@/components/ui/button";

type MetersListHeaderProps = {
	count: number;
	onRefresh: () => void;
};

export function MetersListHeader({ count, onRefresh }: MetersListHeaderProps) {
	return (
		<div className="flex justify-between items-center">
			<h3 className="text-lg font-semibold">Registered Meters ({count})</h3>
			<Button size="sm" onClick={onRefresh}>
				Refresh
			</Button>
		</div>
	);
}
