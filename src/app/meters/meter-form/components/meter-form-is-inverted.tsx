import { useFormContext } from "react-hook-form";

import {
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import type { MeterFormData } from "@/db/schema";

function MeterFormIsInverted() {
	const {
		control,
		formState: { isSubmitting },
	} = useFormContext<MeterFormData>();

	return (
		<FormField
			control={control}
			name="isInverted"
			render={({ field }) => (
				<FormItem className="flex flex-col items-center justify-between rounded-lg border p-4">
					<div className="flex items-center justify-between w-full gap-2">
						<div className="space-y-0.5">
							<FormLabel className="text-base">Medidor Invertido</FormLabel>
							<FormDescription>
								Ative se o medidor foi instalado invertido. Isso inverterá o
								sinal da potência ativa/reativa e trocará consumo com geração.
							</FormDescription>
						</div>
						<FormControl>
							<Switch
								disabled={isSubmitting}
								checked={field.value}
								onCheckedChange={field.onChange}
							/>
						</FormControl>
					</div>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
}

export { MeterFormIsInverted };
