import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { Meter } from "@/db/schema";
import type { SubmitState } from "./meter-form.types";
import type { MeterFormValues } from "./meter-form.schema";

export function useMeterFormSubmit(meter: Meter | undefined) {
	const [state, setState] = useState<SubmitState>({
		error: null,
		success: null,
		loading: false,
	});

	const queryClient = useQueryClient();

	const resetMessages = () => {
		setState(prev => ({
			...prev,
			error: null,
			success: null,
		}));
	};

	const handleSubmit = async (
		values: MeterFormValues,
		onSuccess?: () => void,
	) => {
		setState(prev => ({ ...prev, loading: true }));
		resetMessages();

		try {
			const method = meter ? "PUT" : "POST";
			const url = meter ? `/api/meters/${meter.meterId}` : "/api/meters";

			const payloadData: Record<string, string | undefined> = {
				meterType: values.meterType.trim(),
				location: values.location.trim(),
				status: values.status,
			};

			if (!meter && values.prefix?.trim()) {
				payloadData.prefix = values.prefix.trim();
			}

			const response = await fetch(url, {
				method,
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(payloadData),
			});

			const result = (await response.json()) as {
				status: string;
				message?: string;
				data?: unknown;
			};

			if (!response.ok) {
				setState(prev => ({
					...prev,
					error: result.message || "Failed to save meter",
				}));
				return;
			}

			const successMessage = meter
				? "Meter updated successfully"
				: "Meter created successfully";

			setState(prev => ({
				...prev,
				success: successMessage,
			}));

			// Invalidate queries
			await queryClient.invalidateQueries({ queryKey: ["meters"] });

			setTimeout(() => {
				onSuccess?.();
			}, 1500);
		} catch (err) {
			setState(prev => ({
				...prev,
				error: err instanceof Error ? err.message : "An error occurred",
			}));
		} finally {
			setState(prev => ({ ...prev, loading: false }));
		}
	};

	return {
		state,
		handleSubmit,
		resetMessages,
	};
}
