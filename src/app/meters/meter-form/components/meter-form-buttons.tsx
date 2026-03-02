import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

function MeterFormButtons({
	onCancel,
	hasMeter,
}: {
	onCancel?: () => void;
	hasMeter: boolean;
}) {
	const {
		formState: { isSubmitting, isDirty },
	} = useFormContext();

	return (
		<div className="flex gap-2 justify-end pt-4">
			<Button
				type="button"
				variant="outline"
				onClick={onCancel}
				disabled={isSubmitting}
			>
				Cancelar
			</Button>
			<Button type="submit" disabled={isSubmitting || !isDirty}>
				{isSubmitting && <Spinner />}
				{hasMeter
					? isSubmitting
						? "Atualizando "
						: "Atualizar "
					: isSubmitting
						? "Criando "
						: "Criar "}
				Medidor
			</Button>
		</div>
	);
}

export { MeterFormButtons };
