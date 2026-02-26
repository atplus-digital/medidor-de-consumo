import { MetersList } from "@/components/meters/meters-list/meters-list";
import { NewMeter } from "@/components/meters/new-meter/new-meter";

export function MetersManager() {
	return (
		<div className="space-y-6">
			<div>
				<div className="flex items-center justify-between">
					<h1 className="text-3xl font-bold tracking-tight">Medidores</h1>
					<NewMeter />
				</div>
				<p className="text-muted-foreground mt-2">
					Gerencie seus medidores de consumo de energia aqui.
				</p>
			</div>
			<MetersList />
		</div>
	);
}
