import { useFormContext } from "react-hook-form";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";


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
					<FormLabel>Tipo do Medidor *</FormLabel>
					<FormControl>
						<Input disabled={isSubmitting} placeholder="Modelo, Marca, Tipo..." {...field} />
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
}

export { MeterFormType };
