import { useFormContext } from "react-hook-form";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { FORM_LABELS, FORM_PLACEHOLDERS } from "../meter-form.constants";

function MeterFormType() {
	const {
		control,
		formState: { isSubmitting },
	} = useFormContext();
	return (
		<FormField
			control={control}
			name="meterType"
			render={({ field }) => (
				<FormItem>
					<FormLabel>{FORM_LABELS.meterType}</FormLabel>
					<FormControl>
						<Input
							disabled={isSubmitting}
							placeholder={FORM_PLACEHOLDERS.meterType}
							{...field}
						/>
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
}

export { MeterFormType };
