import { useFormContext } from "react-hook-form";

import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

function MeterFormName() {
	const {
		control,
		formState: { isSubmitting },
	} = useFormContext();
	return (
		<FormField
			control={control}
			name="meterName"
			render={({ field }) => (
				<FormItem>
					<FormLabel>Nome do Medidor *</FormLabel>
					<FormControl>
						<Input disabled={isSubmitting} placeholder="ex.: Medidor Principal, Prédio A" {...field} />
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
}

export { MeterFormName };
