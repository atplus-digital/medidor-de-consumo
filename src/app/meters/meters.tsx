import { MetersList } from "@/app/meters/meters-list/meters-list";
import { MeterFormDialog } from "./meter-form/meter-form-dialog";

export function Meters() {
	return (
		<div className="space-y-2">
			<div>
				<div className="flex items-center justify-between">
					<h1 className="text-3xl font-bold tracking-tight">Medidores</h1>
					<MeterFormDialog />
				</div>
				<p className="text-muted-foreground mt-2">
					Gerencie seus medidores de consumo de energia aqui.
				</p>
			</div>
			<MetersList />
		</div>
	);
}
