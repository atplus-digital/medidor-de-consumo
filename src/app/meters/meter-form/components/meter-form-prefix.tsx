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

import {
	FORM_DESCRIPTIONS,
	FORM_LABELS,
	FORM_PLACEHOLDERS,
} from "../meter-form.constants";

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
					<FormLabel>{FORM_LABELS.prefix}</FormLabel>
					<FormControl>
						<Input
							disabled={isSubmitting}
							placeholder={FORM_PLACEHOLDERS.prefix}
							title={"Prefixo não pode ser alterado após criação"}
							maxLength={50}
							{...field}
							value={field.value || ""}
						/>
					</FormControl>
					<FormDescription>{FORM_DESCRIPTIONS.prefix}</FormDescription>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
}

export { MeterFormPrefix };
