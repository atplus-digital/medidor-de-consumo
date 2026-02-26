import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { MeterForm } from "../meters-form";
import { Button } from "@/components/ui/button";
import { useState } from "react";

function NewMeter() {
	const [open, setOpen] = useState(false);
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button>Novo Medidor</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-2xl">
				<DialogHeader>
					<DialogTitle>Novo Medidor</DialogTitle>
					<DialogDescription>Crie um novo medidor de energia</DialogDescription>
				</DialogHeader>
				<MeterForm
					onCancel={() => setOpen(false)}
					onSuccess={() => setOpen(false)}
				/>
			</DialogContent>
		</Dialog>
	);
}

export { NewMeter };
