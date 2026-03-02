import { useFormContext } from "react-hook-form";
import {
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { MeterFormData } from "@/db/schema";
import { FORM_DESCRIPTIONS, FORM_LABELS } from "../meter-form.constants";

function MeterFormCostPerKwh() {
	const {
		control,
		formState: { isSubmitting },
	} = useFormContext<MeterFormData>();

	return (
		<FormField
			control={control}
			name="costPerKwh"
			render={({ field }) => (
				<FormItem>
					<FormLabel>{FORM_LABELS.costPerKwh}</FormLabel>
					<FormControl>
						<Input
							type="number"
							min={0}
							step="0.0001"
							disabled={isSubmitting}
							placeholder="ex.: 0.7500"
							{...field}
							onChange={(e) =>
								field.onChange(
									Number.isNaN(e.target.valueAsNumber)
										? 0
										: e.target.valueAsNumber,
								)
							}
						/>
					</FormControl>
					<FormDescription>{FORM_DESCRIPTIONS.costPerKwh}</FormDescription>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
}

export { MeterFormCostPerKwh };
