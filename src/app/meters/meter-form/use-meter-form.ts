import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { type Meter, type MeterFormData, meterFormSchema } from "@/db/schema";
import {
	createMeterFn,
	normalizeReadingsFn,
	updateMeterFn,
} from "@/server/meters";

export function useMeterForm(meter: Meter | undefined, onSuccess?: () => void) {
	const queryClient = useQueryClient();

	const [shouldNormalize, setShouldNormalize] = useState(false);

	const form = useForm<MeterFormData>({
		resolver: zodResolver(meterFormSchema),
		mode: "onBlur",
		defaultValues: {
			meterName: meter?.meterName ?? "",
			meterType: meter?.meterType ?? "",
			location: meter?.location ?? "",
			status:
				(meter?.status as "active" | "inactive" | "maintenance") ?? "active",
			prefix: meter?.prefix ?? "",
			isInverted: meter?.isInverted ?? false,
			costPerKwh: meter?.costPerKwh ? Number(meter.costPerKwh) : 0,
			revenuePerKwh: meter?.revenuePerKwh ? Number(meter.revenuePerKwh) : 0,
		},
	});

	const handleSubmit = async (values: MeterFormData) => {
		if (!meter) {
			return await createMeterFn({
				data: {
					...values,
					prefix: values.prefix?.trim() || null,
				},
			});
		}

		const updated = await updateMeterFn({
			data: {
				meterId: meter.meterId,
				data: {
					meterName: values.meterName,
					meterType: values.meterType,
					location: values.location,
					isInverted: values.isInverted,
					status: values.status,
					costPerKwh: values.costPerKwh,
					revenuePerKwh: values.revenuePerKwh,
				},
			},
		});

		const isInvertedChanged = form.formState.dirtyFields.isInverted;

		if (isInvertedChanged && shouldNormalize) {
			try {
				await normalizeReadings.mutateAsync();
			} finally {
				setShouldNormalize(false);
			}
		}

		return updated;
	};

	const normalizeReadings = useMutation({
		mutationFn: async () => {
			if (!meter?.meterId) {
				return;
			}
			return toast.promise(
				async () => await normalizeReadingsFn({ data: meter.meterId }),
				{
					position: "bottom-right",
					loading: "Normalizando leituras...",
					success: "Leituras normalizadas com sucesso!",
					error: (err) => `Error: ${err.message}`,
				},
			);
		},
		mutationKey: ["normalize-readings", meter?.meterId],
	});

	const mutation = useMutation({
		mutationFn: handleSubmit,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["meters"] });

			const successMessage = meter
				? "Medidor atualizado com sucesso"
				: "Medidor criado com sucesso";

			toast.success(successMessage, { duration: 1000 });
			onSuccess?.();
		},
		onError: (error) => {
			toast.error(error instanceof Error ? error.message : "Ocorreu um erro");
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["energy-logs"] });
			queryClient.invalidateQueries({ queryKey: ["energy-stats"] });
			queryClient.invalidateQueries({ queryKey: ["meters"] });
			queryClient.invalidateQueries({ queryKey: ["meter", meter?.meterId] });
		},
	});

	return {
		form,
		handleSubmit: form.handleSubmit((values) => mutation.mutateAsync(values)),
		shouldNormalize,
		setShouldNormalize,
	};
}
