import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteMeterFn } from "@/server/meters";

export function useMeterDelete(onDelete?: () => void) {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: (meterId: string) => deleteMeterFn({ data: meterId }),

		onSuccess: () => {
			onDelete?.();

			toast.success("Medidor excluído com sucesso");
		},
		onError: (error) => {
			toast.error(error instanceof Error ? error.message : "Ocorreu um erro");
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["meters"] });
		},
	});

	return { deleting: mutation.isPending, handleDelete: mutation.mutateAsync };
}
