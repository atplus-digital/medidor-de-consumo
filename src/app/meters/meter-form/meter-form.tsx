import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { type Meter, metersUpdateSchema, type UpdateMeter } from "@/db/schema";
import {
	FORM_DESCRIPTIONS,
	FORM_LABELS,
	FORM_PLACEHOLDERS,
	STATUS_LABELS,
	STATUS_OPTIONS,
} from "./meter-form.constants";
import { useMeterFormSubmit } from "./use-meter-form-submit";

export interface MeterFormProps {
	meter?: Meter;
	onSuccess?: () => void;
	onCancel?: () => void;
}

export function MeterForm({ meter, onSuccess, onCancel }: MeterFormProps) {
	const { handleSubmit, isPending } = useMeterFormSubmit(meter, onSuccess);

	const form = useForm<UpdateMeter>({
		resolver: zodResolver(metersUpdateSchema),
		defaultValues: {
			meterName: meter?.meterName ?? "",
			meterType: meter?.meterType ?? "",
			location: meter?.location ?? "",
			status:
				(meter?.status as "active" | "inactive" | "maintenance") ?? "active",
			prefix: meter?.prefix ?? "",
			isInverted: meter?.isInverted ?? false,
		},
	});

	const onSubmit = async (values: UpdateMeter) => {
		await handleSubmit(values);
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
				<div className="grid grid-cols-1 gap-4">
					<FormField
						control={form.control}
						name="meterName"
						render={({ field }) => (
							<FormItem>
								<FormLabel>{FORM_LABELS.meterName}</FormLabel>
								<FormControl>
									<Input placeholder={FORM_PLACEHOLDERS.meterName} {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="meterType"
						render={({ field }) => (
							<FormItem>
								<FormLabel>{FORM_LABELS.meterType}</FormLabel>
								<FormControl>
									<Input placeholder={FORM_PLACEHOLDERS.meterType} {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
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
					{!meter && (
						<FormField
							control={form.control}
							name="prefix"
							render={({ field }) => (
								<FormItem>
									<FormLabel>{FORM_LABELS.prefix}</FormLabel>
									<FormControl>
										<Input
											placeholder={FORM_PLACEHOLDERS.prefix}
											title={
												meter
													? "Prefixo não pode ser alterado após criação"
													: ""
											}
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
					)}

					<FormField
						control={form.control}
						name="isInverted"
						render={({ field }) => (
							<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
								<div>
									<div className="space-y-0.5">
										<FormLabel className="text-base">
											{FORM_LABELS.isInverted}
										</FormLabel>
										<FormDescription>
											{FORM_DESCRIPTIONS.isInverted}
										</FormDescription>
									</div>
									<FormControl>
										<Switch
											checked={field.value}
											onCheckedChange={field.onChange}
										/>
									</FormControl>
								</div>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
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
				</div>

				<div className="flex gap-2 justify-end pt-4">
					<Button
						type="button"
						variant="outline"
						onClick={onCancel}
						disabled={isPending}
					>
						Cancelar
					</Button>
					<Button type="submit" disabled={isPending}>
						{isPending
							? "Salvando..."
							: meter
								? "Atualizar Medidor"
								: "Criar Medidor"}
					</Button>
				</div>
			</form>
		</Form>
	);
}
