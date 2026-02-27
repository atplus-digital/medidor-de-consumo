import { useFormContext } from "react-hook-form";

import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

import {
	FORM_LABELS,
	STATUS_LABELS,
	STATUS_OPTIONS,
} from "../meter-form.constants";

function MeterFormStatus() {
	const { control } = useFormContext();
	return (
		<FormField
			control={control}
			name="status"
			render={({ field }) => (
				<FormItem>
					<FormLabel>{FORM_LABELS.status}</FormLabel>
					<FormControl>
						<Select value={field.value} onValueChange={field.onChange}>
							<SelectTrigger className="w-full">
								<SelectValue placeholder="Selecione o status" />
							</SelectTrigger>
							<SelectContent>
								{STATUS_OPTIONS.map((status) => (
									<SelectItem key={status} value={status}>
										{STATUS_LABELS[status]}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
}

export { MeterFormStatus };
