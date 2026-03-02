import { CheckIcon, Copy } from "lucide-react";
import { useCopyText } from "@/app/hooks/use-copy-text";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function CopyTextButton({
	value,
	...props
}: {
	value: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
	const [copiedMeterID, handleCopyMeterID] = useCopyText();

	return (
		<Button
			size="icon"
			variant="outline"
			onClick={() => handleCopyMeterID(value)}
			className=" relative"
			title="Copiar ID"
			{...props}
		>
			<CheckIcon
				className={cn(
					"size-4 text-green-600 transition-all scale-0 -rotate-90",
					copiedMeterID && "scale-100 rotate-0",
				)}
			/>
			<Copy
				className={cn(
					"absolute size-4 scale-100 rotate-0 transition-all",
					copiedMeterID && "scale-0 -rotate-90",
				)}
			/>
		</Button>
	);
}

export { CopyTextButton };
