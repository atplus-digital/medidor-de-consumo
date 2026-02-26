import { Check, Copy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCopyMeterID } from "./hooks/use-copy-meter-id";
import { Input } from "@/components/ui/input";
import { DeleteMeterButton } from "./delete-meter-button";
import { MeterFormDialog } from "../../meter-form/meter-form-dialog";
import type { Meter } from "@/db/schema";

export interface MeterCardProps {
	meter: Meter;
}

export function MeterCard({ meter }: MeterCardProps) {
	const { copiedMeterID, handleCopyMeterID } = useCopyMeterID();

	return (
		<Card className="gap-2">
			<CardHeader className="pt-0 gap-1">
				<div className="flex-1 flex items-center justify-between">
					<CardTitle className="text-lg">{meter.meterName}</CardTitle>
					<Badge variant={meter.status === "active" ? "default" : "secondary"}>
						{meter.status}
					</Badge>
				</div>
				<CardDescription>{meter.meterType}</CardDescription>
			</CardHeader>
			<Separator />
			<CardContent className="gap-4 grid py-2 px-4">
				<div className="space-y-2">
					<div className="grid grid-cols-1 gap-3 text-sm">
						<div>
							<div className="flex items-center gap-2">
								<Input disabled value={`ID ${meter.meterId}`} />
								<Button
									size="sm"
									variant="outline"
									onClick={() => handleCopyMeterID(meter.meterId)}
									className="h-auto p-2"
									title="Copiar ID do Medidor"
								>
									{copiedMeterID ? (
										<Check className="w-4 h-4 text-green-600" />
									) : (
										<Copy className="w-4 h-4" />
									)}
								</Button>
							</div>
						</div>
					</div>
				</div>

				<div className="grid grid-cols-2 gap-2">
					<MeterFormDialog meter={meter} />
					<DeleteMeterButton meterId={meter.meterId} />
				</div>
			</CardContent>
		</Card>
	);
}
