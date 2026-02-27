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
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import type { Meter } from "@/db/schema";
import { STATUS_LABELS } from "../../meter-form/meter-form.constants";
import { MeterFormDialog } from "../../meter-form/meter-form-dialog";
import { DeleteMeterButton } from "./delete-meter-button";
import { useCopyMeterID } from "./hooks/use-copy-meter-id";

export function MeterCard({ meter }: { meter: Meter }) {
	const { copiedMeterID, handleCopyMeterID } = useCopyMeterID();

	return (
		<Card className="gap-2">
			<CardHeader className="pt-0 gap-1">
				<div className="flex-1 flex items-center justify-between">
					<CardTitle className="text-lg">{meter.meterName}</CardTitle>
					<div className="flex gap-2">
						{meter.isInverted && (
							<Badge
								variant="outline"
								className="text-orange-600 border-orange-600"
							>
								Invertido
							</Badge>
						)}
						<Badge
							variant={meter.status === "active" ? "default" : "secondary"}
						>
							{STATUS_LABELS[meter.status] ?? meter.status}
						</Badge>
					</div>
				</div>
				<CardDescription>{meter.meterType}</CardDescription>
			</CardHeader>
			<Separator />
			<CardContent className="gap-4 grid py-2 px-4">
				<div className="flex items-center gap-2">
					<Input disabled value={meter.meterId} />
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

				<div className="grid grid-cols-2 gap-2">
					<MeterFormDialog meter={meter} />
					<DeleteMeterButton meterId={meter.meterId} />
				</div>
			</CardContent>
		</Card>
	);
}
