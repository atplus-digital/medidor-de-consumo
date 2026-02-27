import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import type { Meter, UpdateMeter } from "@/db/schema";

export interface SubmitState {
	error: string | null;
	success: string | null;
	loading: boolean;
}

export function useMeterFormSubmit(
	meter: Meter | undefined,
	onSuccess?: () => void,
) {
	const queryClient = useQueryClient();

	const handleSubmit = async (values: UpdateMeter) => {
		const url = meter ? `/api/meters/${meter.meterId}` : "/api/meters";

		const payloadData: Record<string, string | number | undefined | boolean> = {
			meterName: values.meterName?.trim(),
			meterType: values.meterType?.trim(),
			location: values.location?.trim(),
			isInverted: values.isInverted || 0,
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
		handleSubmit: mutation.mutateAsync,
		isPending: mutation.isPending,
	};
}
