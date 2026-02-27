import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getMetersFn } from "@/server/meters";

export function useMetersList() {
	const queryClient = useQueryClient();

	const {
		data: meters,
		isLoading,
		error,
		refetch,
	} = useQuery({
		queryKey: ["meters"],
		queryFn: () => getMetersFn(),
	});

	const refresh = () => {
		queryClient.invalidateQueries({ queryKey: ["meters"] });
		refetch();
	};

	return { meters, isLoading, error, refresh };
}
