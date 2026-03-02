"use client";

import { useId } from "react";
import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";

interface MeterNormalizeReadingsProps {
	shouldNormalize: boolean;
	setShouldNormalize: (value: boolean) => void;
	isNormalizing: boolean;
}

function MeterNormalizeReadings({
	shouldNormalize,
	setShouldNormalize,
	isNormalizing,
}: MeterNormalizeReadingsProps) {
	const id = useId();

	const {
		formState: { isSubmitting },
	} = useFormContext();

	return (
		<div className="flex justify-between items-center gap-3 rounded-md border border-destructive p-4">
			<div className="flex flex-col gap-2">
				<Label htmlFor={id} className="flex gap-2 cursor-pointer">
					{isNormalizing && <Spinner />}
					Normalizar Leituras
				</Label>
				<span className="text-sm font-normal text-muted-foreground">
					Recalcula todas as leituras com base na nova configuração de inversão
				</span>
				<span className="text-sm font-normal text-muted-foreground">
					Isso pode levar algum tempo dependendo da quantidade de leituras
					registradas
				</span>
			</div>
			<Switch
				disabled={isSubmitting}
				id={id}
				checked={shouldNormalize}
				onCheckedChange={setShouldNormalize}
			/>
		</div>
	);
}

export { MeterNormalizeReadings };
