import type { Meter } from "@/db/schema";

export interface MeterFormProps {
	meter?: Meter;
	onSuccess?: () => void;
	onCancel?: () => void;
}

export interface SubmitState {
	error: string | null;
	success: string | null;
	loading: boolean;
}
