import { Gauge } from "lucide-react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

interface MeterSelectProps {
	meterIds: string[];
	value: string | undefined;
	onChange: (value: string | undefined) => void;
}

function MeterSelect({ meterIds, value, onChange }: MeterSelectProps) {
	return (
		<Select
			value={value ?? "all"}
			onValueChange={val => onChange(val === "all" ? undefined : val)}
		>
			<SelectTrigger className="w-40">
				<Gauge className="mr-2 size-4" />
				<SelectValue placeholder="Todos os medidores" />
			</SelectTrigger>
			<SelectContent>
				<SelectItem value="all">Todos os medidores</SelectItem>
				{meterIds.map(id => (
					<SelectItem key={id} value={id}>
						Medidor {id}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}

export { MeterSelect };
