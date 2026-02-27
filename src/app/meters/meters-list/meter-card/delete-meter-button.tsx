import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { deleteMeterFn } from "@/server/meters";
import { useMetersList } from "../use-meters-list";

function DeleteMeterButton({ meterId }: { meterId: string }) {
	const { refresh } = useMetersList();

	const queryClient = useQueryClient();

	const { isPending, mutateAsync } = useMutation({
		mutationFn: () => deleteMeterFn({ data: meterId }),
		onSuccess: () => {
			refresh();

			toast.success("Medidor excluído com sucesso");
		},
		onError: (error) => {
			toast.error(error instanceof Error ? error.message : "Ocorreu um erro");
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["meters"] });
		},
	});

	const onHandleDelete = async () => {
		await mutateAsync();
	};

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button variant="destructive" disabled={isPending} className="flex-1">
					<Trash2 className="w-4 h-4 mr-1" />
					{isPending ? "Deletando..." : "Deletar"}
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>
						Tem certeza que deseja deletar este medidor?
					</AlertDialogTitle>
					<AlertDialogDescription>
						Essa ação não pode ser desfeita. Isso irá excluir permanentemente o
						medidor. Todos os logs associados a este medidor também serão
						excluídos.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancelar</AlertDialogCancel>
					<AlertDialogAction variant="destructive" onClick={onHandleDelete}>
						Excluir
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}

export { DeleteMeterButton };
