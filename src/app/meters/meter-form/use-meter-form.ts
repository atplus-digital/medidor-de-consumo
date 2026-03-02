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
	const [isNormalizing, setIsNormalizing] = useState(false);

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
		if (meter) {
			await updateMeterFn({
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

			// Normalize readings if isInverted was changed and user opted in
			if (form.formState.dirtyFields.isInverted && shouldNormalize) {
				setIsNormalizing(true);
				try {
					await normalizeReadingsFn({ data: meter.meterId });

					toast.success("Leituras normalizadas com sucesso");
					queryClient.invalidateQueries({ queryKey: ["energy-logs"] });
					queryClient.invalidateQueries({ queryKey: ["energy-stats"] });
				} catch (error) {
					toast.error(
						error instanceof Error
							? error.message
							: "Erro ao normalizar leituras",
					);
				} finally {
					setShouldNormalize(false);
					setIsNormalizing(false);
				}
			}
		} else {
			await createMeterFn({
				data: {
					...values,
					prefix: values.prefix?.trim() || null,
				},
			});
		}

		return true;
	};

	const mutation = useMutation({
		mutationFn: handleSubmit,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["meters"] });

			const successMessage = meter
				? "Medidor atualizado com sucesso"
				: "Medidor criado com sucesso";

			toast.success(successMessage);
			onSuccess?.();
		},
		onError: (error) => {
			toast.error(error instanceof Error ? error.message : "Ocorreu um erro");
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["meters"] });
		},
	});

	return {
		form,
		handleSubmit: mutation.mutateAsync,
		shouldNormalize,
		setShouldNormalize,
		isNormalizing,
	};
}
