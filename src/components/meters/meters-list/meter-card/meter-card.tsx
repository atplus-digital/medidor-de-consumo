import { Check, Copy, Edit2, Trash2 } from "lucide-react";
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
import { STATUS_COLOR_MAP } from "./meter-card.constants";
import type { MeterCardProps } from "./meter-card.types";
import { useCopyMeterID } from "./hooks/use-copy-meter-id";
import { useMeterDelete } from "./hooks/use-meter-delete";

export function MeterCard({ meter, onEdit, onDelete }: MeterCardProps) {
	const { copiedMeterID, handleCopyMeterID } = useCopyMeterID();
	const { deleting, handleDelete } = useMeterDelete();

	const onHandleDelete = async () => {
		await handleDelete(meter.meterId, onDelete);
	};

	return (
		<Card>
			<CardHeader className="pb-3">
				<div className="flex items-start justify-between">
					<div className="flex-1">
						<CardTitle className="text-lg">{meter.meterType}</CardTitle>
						<CardDescription>{meter.location}</CardDescription>
					</div>
					<Badge
						className={
							STATUS_COLOR_MAP[meter.status as keyof typeof STATUS_COLOR_MAP]
						}
					>
						{meter.status}
					</Badge>
				</div>
			</CardHeader>
			<Separator />
			<CardContent className="pt-4">
				<div className="space-y-2 mb-4">
					<div className="grid grid-cols-1 gap-3 text-sm">
						<div>
							<p className="text-muted-foreground mb-1">Meter ID</p>
							<div className="flex items-center gap-2">
								<code className="flex-1 text-xs bg-slate-100 p-2 rounded break-all">
									{meter.meterId}
								</code>
								<Button
									size="sm"
									variant="outline"
									onClick={() => handleCopyMeterID(meter.meterId)}
									className="h-auto p-2"
									title="Copy Meter ID"
								>
									{copiedMeterID ? (
										<Check className="w-4 h-4 text-green-600" />
									) : (
										<Copy className="w-4 h-4" />
									)}
								</Button>
							</div>
						</div>
						<div className="grid grid-cols-2 gap-3">
							{meter.prefix && (
								<div>
									<p className="text-muted-foreground">Prefix</p>
									<p className="font-mono text-xs">{meter.prefix}</p>
								</div>
							)}
							<div>
								<p className="text-muted-foreground">Created</p>
								<p className="text-xs">
									{new Date(meter.createdAt).toLocaleDateString("pt-BR")}
								</p>
							</div>
							<div>
								<p className="text-muted-foreground">Updated</p>
								<p className="text-xs">
									{new Date(meter.updatedAt).toLocaleDateString("pt-BR")}
								</p>
							</div>
						</div>
					</div>
				</div>

				<div className="flex gap-2">
					<Button
						size="sm"
						variant="outline"
						onClick={onEdit}
						className="flex-1"
					>
						<Edit2 className="w-4 h-4 mr-1" />
						Edit
					</Button>
					<Button
						size="sm"
						variant="destructive"
						onClick={onHandleDelete}
						disabled={deleting}
						className="flex-1"
					>
						<Trash2 className="w-4 h-4 mr-1" />
						{deleting ? "Deleting..." : "Delete"}
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
