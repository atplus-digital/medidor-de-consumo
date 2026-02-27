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
import type { Meter } from "@/db/schema";
import { MeterForm } from ".";

function MeterFormDialog({ meter }: { meter?: Meter }) {
	const [open, setOpen] = useState(false);
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button>
					{meter ? (
						<Edit2 className="size-4" />
					) : (
						<PlusIcon className="size-4" />
					)}
					{meter ? "Editar" : "Adicionar Medidor"}
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-2xl">
				<DialogHeader>
					<DialogTitle>{meter ? "Editar Medidor" : "Novo Medidor"}</DialogTitle>
					<DialogDescription>
						{!meter && "Crie um novo medidor de energia"}
					</DialogDescription>
				</DialogHeader>
				<MeterForm
					meter={meter}
					onCancel={() => setOpen(false)}
					onSuccess={() => setOpen(false)}
				/>
			</DialogContent>
		</Dialog>
	);
}

export { MeterFormDialog };
