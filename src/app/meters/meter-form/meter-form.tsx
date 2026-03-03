import { Form } from "@/components/ui/form";
import type { Meter } from "@/db/schema";
import { MeterFormButtons } from "./components/meter-form-buttons";
import { MeterFormCostPerKwh } from "./components/meter-form-cost-per-kwh";
import { MeterFormIsInverted } from "./components/meter-form-is-inverted";
import { MeterFormLocation } from "./components/meter-form-location";
import { MeterFormName } from "./components/meter-form-name";
import { MeterFormPrefix } from "./components/meter-form-prefix";
import { MeterFormRevenuePerKwh } from "./components/meter-form-revenue-per-kwh";
import { MeterFormStatus } from "./components/meter-form-status";
import { MeterFormType } from "./components/meter-form-type";
import { MeterNormalizeReadings } from "./components/meter-normalize-readings";
import { useMeterForm } from "./use-meter-form";

export interface MeterFormProps {
	meter?: Meter;
	onCancel?: () => void;
}

export function MeterForm({ meter, onCancel }: MeterFormProps) {
	const { form, handleSubmit, shouldNormalize, setShouldNormalize } =
		useMeterForm(meter, () => onCancel?.());

	const hasMeter = Boolean(meter);
	const canNormalize = hasMeter && form.formState.dirtyFields.isInverted;

	return (
		<Form {...form}>
			<form onSubmit={handleSubmit} className="space-y-4">
				<div className="grid grid-cols-1 gap-4">
					<MeterFormStatus />
					<MeterFormName />
					{!hasMeter && <MeterFormPrefix />}
					<MeterFormType />
					<MeterFormLocation />

					<MeterFormIsInverted />
					{canNormalize && (
						<MeterNormalizeReadings
							shouldNormalize={shouldNormalize}
							setShouldNormalize={setShouldNormalize}
						/>
					)}
					{hasMeter && (
						<div className="grid grid-cols-2 gap-4">
							<MeterFormCostPerKwh />
							<MeterFormRevenuePerKwh />
						</div>
					)}
				</div>
				<MeterFormButtons onCancel={onCancel} hasMeter={hasMeter} />
			</form>
		</Form>
	);
}
