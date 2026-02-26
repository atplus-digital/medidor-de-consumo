import type { Meter } from "@/db/schema";

export interface MeterCardProps {
	meter: Meter;
	onEdit: () => void;
	onDelete: () => void;
}
