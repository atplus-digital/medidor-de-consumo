import { useFormContext } from "react-hook-form";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

function MeterFormLocation() {
	const {
		control,
		formState: { isSubmitting },
	} = useFormContext();
	return (
		<FormField
			control={control}
			name="location"
			render={({ field }) => (
				<FormItem>
					<FormLabel>Localização *</FormLabel>
					<FormControl>
						<Input disabled={isSubmitting} placeholder="ex.: Prédio A - Andar 1" {...field} />
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
}

export { MeterFormLocation };
