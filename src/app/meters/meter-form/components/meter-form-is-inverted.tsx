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
import { FORM_DESCRIPTIONS, FORM_LABELS } from "../meter-form.constants";

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
							<FormLabel className="text-base">
								{FORM_LABELS.isInverted}
							</FormLabel>
							<FormDescription>{FORM_DESCRIPTIONS.isInverted}</FormDescription>
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
