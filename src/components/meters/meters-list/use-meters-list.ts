import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { Meter } from "@/db/schema";

export function useMetersList() {
	const queryClient = useQueryClient();

	const {
		data: meters,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["meters"],
		queryFn: async () => {
			const response = await fetch("/api/meters");
			if (!response.ok) throw new Error("Failed to fetch meters");
			const result = (await response.json()) as { data: Meter[] };
			return result.data;
		},
	});

	const refresh = () => {
		queryClient.invalidateQueries({ queryKey: ["meters"] });
	};

	return { meters, isLoading, error, refresh };
}
