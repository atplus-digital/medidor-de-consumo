import { Activity, Clock, Gauge, Radio, Waves, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { EnergyLog } from "@/db/schema";
import { formatNumber, formatRelative } from "@/lib/format";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface RealTimeReadingProps {
	reading: EnergyLog | null;
	isLoading?: boolean;
}

function ReadingItem({
	icon: Icon,
	label,
	value,
	unit,
}: {
	icon: React.ComponentType<{ className?: string }>;
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

function RealTimeReading({ reading, isLoading }: RealTimeReadingProps) {
	if (isLoading) {
		return (
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Skeleton className="h-5 w-40" />
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
						<Skeleton className="h-20" />
						<Skeleton className="h-20" />
						<Skeleton className="h-20" />
						<Skeleton className="h-20" />
						<Skeleton className="h-20" />
						<Skeleton className="h-20" />
						<Skeleton className="h-20" />
						<Skeleton className="h-20" />
					</div>
				</CardContent>
			</Card>
		);
	}

	if (!reading) {
		return (
			<Card>
				<CardContent className="flex items-center justify-center py-12">
					<p className="text-muted-foreground">Nenhuma leitura disponível</p>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between">
				<CardTitle className="flex items-center gap-2">
					<Radio className="size-5 animate-pulse text-green-500" />
					Leitura em Tempo Real
				</CardTitle>
				<div className="flex items-center gap-2">
					<Badge variant="outline">Medidor: {reading.meterId}</Badge>
					{reading.createdAt && (
						<span className="text-xs text-muted-foreground">
							{formatRelative(reading.createdAt)}
						</span>
					)}
				</div>
			</CardHeader>
			<CardContent>
				<div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
					<ReadingItem
						icon={Zap}
						label="Potência Ativa"
						value={formatNumber(reading.activePower)}
						unit="W"
					/>
					<ReadingItem
						icon={Activity}
						label="Potência Reativa"
						value={formatNumber(reading.reactivePower)}
						unit="VAR"
					/>
					<ReadingItem
						icon={Gauge}
						label="Potência Aparente"
						value={formatNumber(reading.apparentPower)}
						unit="VA"
					/>
					<ReadingItem
						icon={Zap}
						label="Tensão"
						value={formatNumber(reading.voltage, 1)}
						unit="V"
					/>
					<ReadingItem
						icon={Activity}
						label="Corrente"
						value={formatNumber(reading.current, 3)}
						unit="A"
					/>
					<ReadingItem
						icon={Gauge}
						label="Fator de Potência"
						value={formatNumber(reading.powerFactor, 3)}
						unit=""
					/>
					<ReadingItem
						icon={Waves}
						label="Frequência"
						value={formatNumber(reading.frequency, 1)}
						unit="Hz"
					/>
					<ReadingItem
						icon={Clock}
						label="Tempo de Operação"
						value={formatNumber(reading.operationTime, 0)}
						unit="s"
					/>
				</div>
			</CardContent>
		</Card>
	);
}

export { RealTimeReading };
