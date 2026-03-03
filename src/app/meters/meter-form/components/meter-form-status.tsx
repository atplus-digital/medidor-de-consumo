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

// Hard-coded labels/options (inlined per request)
const STATUS_OPTIONS = ["active", "inactive", "maintenance"] as const;
const STATUS_LABELS: Record<string, string> = {
	active: "Ativo",
	inactive: "Inativo",
	maintenance: "Manutenção",
};

function MeterFormStatus() {
	const {
		control,
		formState: { isSubmitting },
	} = useFormContext();
	return (
		<FormField
			control={control}
			name="status"
			render={({ field }) => (
				<FormItem>
					<FormLabel>Status</FormLabel>
					<FormControl>
						<Select value={field.value} onValueChange={field.onChange}>
							<SelectTrigger disabled={isSubmitting} className="w-full">
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
