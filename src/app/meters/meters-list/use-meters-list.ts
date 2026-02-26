import axios from "axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { Meter } from "@/db/schema";

export function useMetersList() {
	const queryClient = useQueryClient();

	const {
		data: meters,
		isLoading,
		error,
		refetch,
	} = useQuery({
		queryKey: ["meters"],
		queryFn: async () => {
			const response = await axios.get<{ data: Meter[] }>("/api/meters");
			return response.data.data;
		},
	});

	const refresh = () => {
		queryClient.invalidateQueries({ queryKey: ["meters"] });
		refetch();
	};

	return { meters, isLoading, error, refresh };
}
