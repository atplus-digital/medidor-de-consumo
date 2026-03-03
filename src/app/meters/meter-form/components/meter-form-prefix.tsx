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


function MeterFormPrefix() {
	const {
		control,
		formState: { isSubmitting },
	} = useFormContext();
	return (
		<FormField
			control={control}
			name="prefix"
			render={({ field }) => (
				<FormItem>
					<FormLabel>Prefixo do Id (Opcional)</FormLabel>
					<FormControl>
						<Input
							disabled={isSubmitting}
							placeholder="ex.: MTR, MEDIDOR-A"
							title={"Prefixo não pode ser alterado após criação"}
							maxLength={50}
							{...field}
							value={field.value || ""}
						/>
					</FormControl>
					<FormDescription>
						O prefixo será combinado com um hash único para gerar o ID do medidor
					</FormDescription>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
}

export { MeterFormPrefix };
