import { Edit2, PlusIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import type { Meter } from "@/db/schema";
import { MeterForm } from "./meter-form";
import { useMeterForm } from "./use-meter-form";

function MeterFormDialog({ meter }: { meter?: Meter }) {
	const [open, setOpen] = useState(false);
	const hasMeter = Boolean(meter);

	const {
		form,
		handleSubmit,
		shouldNormalize,
		setShouldNormalize,
		isNormalizing,
	} = useMeterForm(meter, () => setOpen(false));

	return (
		<Dialog
			open={open}
			onOpenChange={(open_) => {
				setOpen(open_);
				if (!form.formState.isSubmitting) {
				}
			}}
		>
			<DialogTrigger asChild>
				<Button>
					{hasMeter ? (
						<Edit2 className="size-4" />
					) : (
						<PlusIcon className="size-4" />
					)}
					{hasMeter ? "Editar" : "Adicionar Medidor"}
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-2xl">
				<DialogHeader>
					<DialogTitle>
						{hasMeter ? "Editar Medidor" : "Novo Medidor"}
					</DialogTitle>
					<DialogDescription>
						{!hasMeter && "Crie um novo medidor de energia"}
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<MeterForm
						meter={meter}
						onCancel={() => setOpen(false)}
						handleSubmit={handleSubmit}
						shouldNormalize={shouldNormalize}
						setShouldNormalize={setShouldNormalize}
						isNormalizing={isNormalizing}
					/>
				</Form>
			</DialogContent>
		</Dialog>
	);
}

export { MeterFormDialog };
