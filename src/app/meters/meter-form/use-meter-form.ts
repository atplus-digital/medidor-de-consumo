import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
	type Meter,
	type MeterFormData,
	meterFormSchema,
} from "@/db/schema";

export interface SubmitState {
	error: string | null;
	success: string | null;
	loading: boolean;
}

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
		const url = meter ? `/api/meters/${meter.meterId}` : "/api/meters";

		const payloadData: Record<string, string | number | undefined | boolean> = {
			meterName: values.meterName?.trim(),
			meterType: values.meterType?.trim(),
			location: values.location?.trim(),
			isInverted: values.isInverted || false,
			status: values.status,
		};

		if (!meter && values.prefix?.trim()) {
			payloadData.prefix = values.prefix.trim();
		}

		try {
			if (meter) {
				await axios.put(url, payloadData);
			} else {
				await axios.post(url, payloadData);
			}
		} catch (error) {
			if (axios.isAxiosError(error)) {
				const message =
					error.response?.data?.message || "Falha ao salvar medidor";
				throw new Error(message);
			}
			throw error;
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
