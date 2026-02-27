import { Activity, Clock, Gauge, Radio, Waves, Zap } from "lucide-react";
import { useDashboard } from "@/app/dashboard/context/use-dashboard";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNumber, formatRelative } from "@/lib/format";
import { ReadingItem } from "./reading-item";
import { RealTimeReadingLoading } from "./real-time-reading-loading";

function RealTimeReading() {
	const { latestReading, isLoadingReading } = useDashboard();

	if (isLoadingReading) {
		return <RealTimeReadingLoading />;
	}

	if (!latestReading) {
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
					<Badge variant="outline">Medidor: {latestReading.meterId}</Badge>
					{latestReading.createdAt && (
						<span className="text-xs text-muted-foreground">
							{formatRelative(latestReading.createdAt)}
						</span>
					)}
				</div>
			</CardHeader>
			<CardContent>
				<div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
					<ReadingItem
						icon={Zap}
						label="Potência Ativa"
						value={formatNumber(latestReading.activePower)}
						unit="W"
					/>
					<ReadingItem
						icon={Activity}
						label="Potência Reativa"
						value={formatNumber(latestReading.reactivePower)}
						unit="VAR"
					/>
					<ReadingItem
						icon={Gauge}
						label="Potência Aparente"
						value={formatNumber(latestReading.apparentPower)}
						unit="VA"
					/>
					<ReadingItem
						icon={Zap}
						label="Tensão"
						value={formatNumber(latestReading.voltage, 1)}
						unit="V"
					/>
					<ReadingItem
						icon={Activity}
						label="Corrente"
						value={formatNumber(latestReading.current, 3)}
						unit="A"
					/>
					<ReadingItem
						icon={Gauge}
						label="Fator de Potência"
						value={formatNumber(latestReading.powerFactor, 3)}
						unit=""
					/>
					<ReadingItem
						icon={Waves}
						label="Frequência"
						value={formatNumber(latestReading.frequency, 1)}
						unit="Hz"
					/>
					<ReadingItem
						icon={Clock}
						label="Tempo de Operação"
						value={formatNumber(latestReading.operationTime, 0)}
						unit="s"
					/>
				</div>
			</CardContent>
		</Card>
	);
}

export { RealTimeReading };
