import { MeterCard } from "./meter-card/meter-card";
import { EmptyState, ErrorState, LoadingState } from "./meters-list-state";
import { useMetersList } from "./use-meters-list";

export function MetersList() {
	const { meters, isLoading, error, refresh } = useMetersList();

	if (isLoading) {
		return <LoadingState />;
	}

	if (error) {
		return <ErrorState onRetry={refresh} />;
	}

	if (!meters || meters.length === 0) {
		return <EmptyState />;
	}

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
			{meters.map((meter) => (
				<MeterCard key={meter.meterId} meter={meter} />
			))}
		</div>
	);
}
