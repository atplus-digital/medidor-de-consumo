import { CopyTextButton } from "@/components/copy-text-button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import type { Meter } from "@/db/schema";
import { STATUS_LABELS } from "../../meter-form/meter-form.constants";
import { MeterFormDialog } from "../../meter-form/meter-form-dialog";
import { DeleteMeterButton } from "./delete-meter-button";

export function MeterCard({ meter }: { meter: Meter }) {
	return (
		<Card className="gap-2">
			<CardHeader className="pt-0 gap-1 flex-1 flex items-center justify-between">
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
					<Badge variant={meter.status === "active" ? "default" : "secondary"}>
						{STATUS_LABELS[meter.status] ?? meter.status}
					</Badge>
				</div>
			</CardHeader>
			<Separator />
			<CardContent className="gap-4 grid py-2 px-4">
				<div className="flex items-center gap-2">
					<Input disabled value={meter.meterId} />
					<CopyTextButton value={meter.meterId} />
				</div>

				<div className="grid grid-cols-2 gap-2">
					<MeterFormDialog meter={meter} />
					<DeleteMeterButton meterId={meter.meterId} />
				</div>
			</CardContent>
		</Card>
	);
}
