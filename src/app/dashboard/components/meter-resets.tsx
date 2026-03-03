import { useQuery } from "@tanstack/react-query";
import { AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useEnergyFilters } from "@/contexts/energy-filters-context/energy-filters-context";
import { formatDateTime, formatNumber } from "@/lib/format";
import { getMeterResetsFn } from "@/server/energy";

function MeterResets() {
	const { filters } = useEnergyFilters();

	const { data: resets = [], isLoading } = useQuery({
		queryKey: [
			"meter-resets",
			filters.startDate?.toISOString(),
			filters.endDate?.toISOString(),
			filters.meterId,
		],
		queryFn: () =>
			getMeterResetsFn({
				data: {
					startDate: filters.startDate?.toISOString(),
					endDate: filters.endDate?.toISOString(),
					meterId: filters.meterId,
				},
			}),
	});

	if (isLoading) {
		return (
			<Card>
				<CardHeader>
					<Skeleton className="h-5 w-48" />
				</CardHeader>
				<CardContent>
					<Skeleton className="h-20 w-full" />
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between">
				<CardTitle className="flex items-center gap-2">
					<AlertTriangle className="size-5 text-yellow-500" />
					Reinicializações do Medidor
				</CardTitle>
				<Badge variant={resets.length > 0 ? "destructive" : "secondary"}>
					{resets.length} {resets.length === 1 ? "evento" : "eventos"}
				</Badge>
			</CardHeader>
			<CardContent>
				{resets.length === 0 ? (
					<p className="text-sm text-muted-foreground">
						Nenhuma reinicialização detectada no período selecionado.
					</p>
				) : (
					<div className="max-h-80 space-y-3 overflow-y-auto">
						{resets.map((reset) => (
							<div
								key={reset.id}
								className="flex flex-col gap-1 rounded-lg border bg-yellow-500/5 p-3"
							>
								<div className="flex items-center justify-between">
									<Badge variant="outline">Medidor: {reset.meterId}</Badge>
									<span className="text-xs text-muted-foreground">
										{reset.detectedAt
											? formatDateTime(reset.detectedAt)
											: "-"}
									</span>
								</div>
								<div className="mt-1 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
									<span>
										Consumo antes:{" "}
										{formatNumber(reset.previousConsumed ?? 0, 4)} kWh
									</span>
									<span>
										Consumo após reset:{" "}
										{formatNumber(reset.resetConsumed ?? 0, 4)} kWh
									</span>
									<span>
										Geração antes:{" "}
										{formatNumber(reset.previousGenerated ?? 0, 4)} kWh
									</span>
									<span>
										Geração após reset:{" "}
										{formatNumber(reset.resetGenerated ?? 0, 4)} kWh
									</span>
									<span>
										Tempo operação antes:{" "}
										{formatNumber(reset.previousOperationTime ?? 0, 0)} s
									</span>
									<span>
										Tempo operação após:{" "}
										{formatNumber(reset.resetOperationTime ?? 0, 0)} s
									</span>
								</div>
								{reset.lastReadingBefore && (
									<p className="mt-1 text-xs text-muted-foreground">
										Última leitura antes:{" "}
										{formatDateTime(reset.lastReadingBefore)}
									</p>
								)}
							</div>
						))}
					</div>
				)}
			</CardContent>
		</Card>
	);
}

export { MeterResets };
