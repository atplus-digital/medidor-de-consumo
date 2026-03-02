import { useFormContext } from "react-hook-form";
import type { Meter, MeterFormData } from "@/db/schema";
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
import type { useMeterForm } from "./use-meter-form";

type UseMeterFormReturn = ReturnType<typeof useMeterForm>;

export interface MeterFormProps {
	meter?: Meter;
	onCancel?: () => void;
	handleSubmit: UseMeterFormReturn["handleSubmit"];
	shouldNormalize: UseMeterFormReturn["shouldNormalize"];
	setShouldNormalize: UseMeterFormReturn["setShouldNormalize"];
	isNormalizing: UseMeterFormReturn["isNormalizing"];
}

export function MeterForm({
	meter,
	onCancel,
	handleSubmit,
	shouldNormalize,
	setShouldNormalize,
	isNormalizing,
}: MeterFormProps) {
	const form = useFormContext<MeterFormData>();

	return (
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
				{meter && form.formState.dirtyFields.isInverted && (
					<MeterNormalizeReadings
						isNormalizing={isNormalizing}
						shouldNormalize={shouldNormalize}
						setShouldNormalize={setShouldNormalize}
					/>
				)}
				{meter && (
					<div className="grid grid-cols-2 gap-4">
						<MeterFormCostPerKwh />
						<MeterFormRevenuePerKwh />
					</div>
				)}
			</div>
			<MeterFormButtons onCancel={onCancel} hasMeter={!!meter} />
		</form>
	);
}
