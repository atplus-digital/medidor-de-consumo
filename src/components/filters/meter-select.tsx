import { Gauge } from "lucide-react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

interface MeterSelectProps {
	meters: Array<{ id: string; meterName: string }>;
	value: string | undefined;
	onChange: (value: string | undefined) => void;
}

function MeterSelect({ meters, value, onChange }: MeterSelectProps) {
	return (
		<Select
			value={value ?? "all"}
			onValueChange={val => onChange(val === "all" ? undefined : val)}
		>
			<SelectTrigger className="md:max-w-64 w-52">
				<Gauge className="mr-2 size-4" />
				<SelectValue placeholder="Todos os medidores" className="w-full" />
			</SelectTrigger>
			<SelectContent>
				<SelectItem value="all">Todos os medidores</SelectItem>
				{meters.map(meter => (
					<SelectItem key={meter.id} value={meter.id}>
						{meter.meterName}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}

export { MeterSelect };
