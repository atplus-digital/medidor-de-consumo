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

function MeterFormLocation() {
	const { control } = useFormContext();
	return (
		<FormField
			control={control}
			name="location"
			render={({ field }) => (
				<FormItem>
					<FormLabel>{FORM_LABELS.location}</FormLabel>
					<FormControl>
						<Input placeholder={FORM_PLACEHOLDERS.location} {...field} />
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
}

export { MeterFormLocation };
