import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
	type Meter,
	type MeterFormData,
	meterFormSchema,
} from "@/db/schema";
import { createMeterFn, updateMeterFn } from "@/server/meters";

export function useMeterForm(meter: Meter | undefined, onSuccess?: () => void) {
	const queryClient = useQueryClient();

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
					},
				},
			});
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
	};
}
