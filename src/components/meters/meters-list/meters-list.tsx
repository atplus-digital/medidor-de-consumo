import { useState } from "react";
import type { Meter } from "@/db/schema";
import { MeterForm } from "../meters-form";
import { MeterCard } from "./meter-card/meter-card";
import { MetersListHeader } from "./meters-list-header";
import { EmptyState, ErrorState, LoadingState } from "./meters-list-state";
import { useMetersList } from "./use-meters-list";

export function MetersList() {
	const [editingMeter, setEditingMeter] = useState<Meter | null>(null);

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
		<div className="space-y-4">
			<MetersListHeader count={meters.length} onRefresh={refresh} />
			{editingMeter && (
				<MeterForm
					meter={editingMeter}
					onSuccess={() => {
						setEditingMeter(null);
						refresh();
					}}
					onCancel={() => setEditingMeter(null)}
				/>
			)}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{meters.map(meter => (
					<MeterCard
						key={meter.meterId}
						meter={meter}
						onEdit={() => setEditingMeter(meter)}
						onDelete={() => {
							refresh();
						}}
					/>
				))}
			</div>
		</div>
	);
}
