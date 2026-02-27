import { Form } from "@/components/ui/form";
import type { Meter } from "@/db/schema";

import { MeterFormButtons } from "./components/meter-form-buttons";
import { MeterFormIsInverted } from "./components/meter-form-is-inverted";
import { MeterFormLocation } from "./components/meter-form-location";
import { MeterFormName } from "./components/meter-form-name";
import { MeterFormPrefix } from "./components/meter-form-prefix";
import { MeterFormStatus } from "./components/meter-form-status";
import { MeterFormType } from "./components/meter-form-type";
import { useMeterForm } from "./use-meter-form";

export interface MeterFormProps {
	meter?: Meter;
	onSuccess?: () => void;
	onCancel?: () => void;
}

export function MeterForm({ meter, onSuccess, onCancel }: MeterFormProps) {
	const { handleSubmit, form } = useMeterForm(meter, onSuccess);

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit((values) => handleSubmit(values))}
				className="space-y-4"
			>
				<div className="grid grid-cols-1 gap-4">
					<MeterFormStatus />
					<MeterFormName />
					{!meter && <MeterFormPrefix />}
					<MeterFormType />
					<MeterFormLocation />
					<MeterFormIsInverted />
				</div>
				<MeterFormButtons onCancel={onCancel} hasMeter={!!meter} />
			</form>
		</Form>
	);
}
