import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
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
import { meterSchema, type MeterFormValues } from "./meter-form.schema";
import type { MeterFormProps } from "./meter-form.types";
import {
	STATUS_OPTIONS,
	FORM_PLACEHOLDERS,
	FORM_LABELS,
	FORM_DESCRIPTIONS,
} from "./meter-form.constants";
import { useMeterFormSubmit } from "./use-meter-form-submit";

export function MeterForm({ meter, onSuccess, onCancel }: MeterFormProps) {
	const { state, handleSubmit } = useMeterFormSubmit(meter);

	const form = useForm<MeterFormValues>({
		resolver: zodResolver(meterSchema),
		defaultValues: {
			meterName: meter?.meterName ?? "",
			meterType: meter?.meterType ?? "",
			location: meter?.location ?? "",
			status:
				(meter?.status as "active" | "inactive" | "maintenance") ?? "active",
			prefix: meter?.prefix ?? "",
		},
	});

	useEffect(() => {
		form.reset({
			meterName: meter?.meterName ?? "",
			meterType: meter?.meterType ?? "",
			location: meter?.location ?? "",
			status:
				(meter?.status as "active" | "inactive" | "maintenance") ?? "active",
			prefix: meter?.prefix ?? "",
		});
	}, [form, meter]);

	const onSubmit = async (values: MeterFormValues) => {
		await handleSubmit(values, onSuccess);
	};

	return (
		<Card className="w-full">
			<CardHeader>
				<CardTitle>{meter ? "Edit Meter" : "Create New Meter"}</CardTitle>
				<CardDescription>
					{meter
						? "Update the meter information"
						: "Fill in the details to create a new meter. The meter ID will be generated automatically."}
				</CardDescription>
			</CardHeader>
			<CardContent>
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
											<Input
												placeholder={FORM_PLACEHOLDERS.meterName}
												{...field}
											/>
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
											<Input
												placeholder={FORM_PLACEHOLDERS.meterType}
												{...field}
											/>
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
											<Input
												placeholder={FORM_PLACEHOLDERS.location}
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="prefix"
								render={({ field }) => (
									<FormItem>
										<FormLabel>{FORM_LABELS.prefix}</FormLabel>
										<FormControl>
											<Input
												placeholder={FORM_PLACEHOLDERS.prefix}
												disabled={!!meter}
												title={
													meter ? "Prefix cannot be changed after creation" : ""
												}
												maxLength={50}
												{...field}
											/>
										</FormControl>
										<FormDescription>
											{FORM_DESCRIPTIONS.prefix}
										</FormDescription>
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
											<Select
												value={field.value}
												onValueChange={field.onChange}
											>
												<SelectTrigger className="w-full">
													<SelectValue placeholder="Select status" />
												</SelectTrigger>
												<SelectContent>
													{STATUS_OPTIONS.map(status => (
														<SelectItem key={status} value={status}>
															{status.charAt(0).toUpperCase() + status.slice(1)}
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

						{state.error && (
							<div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
								{state.error}
							</div>
						)}

						{state.success && (
							<div className="p-3 bg-green-50 border border-green-200 rounded text-green-700 text-sm">
								{state.success}
							</div>
						)}

						<div className="flex gap-2 justify-end pt-4">
							<Button
								type="button"
								variant="outline"
								onClick={onCancel}
								disabled={state.loading}
							>
								Cancel
							</Button>
							<Button type="submit" disabled={state.loading}>
								{state.loading
									? "Saving..."
									: meter
										? "Update Meter"
										: "Create Meter"}
							</Button>
						</div>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
}
