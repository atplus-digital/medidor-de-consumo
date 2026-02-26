import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DateRangePickerProps {
	startDate: Date | undefined;
	endDate: Date | undefined;
	onStartDateChange: (date: Date | undefined) => void;
	onEndDateChange: (date: Date | undefined) => void;
}

function DateRangePicker({
	startDate,
	endDate,
	onStartDateChange,
	onEndDateChange,
}: DateRangePickerProps) {
	const [startOpen, setStartOpen] = useState(false);
	const [endOpen, setEndOpen] = useState(false);

	return (
		<div className="flex flex-wrap items-center gap-2">
			<Popover open={startOpen} onOpenChange={setStartOpen}>
				<PopoverTrigger asChild>
					<Button
						variant="outline"
						size="sm"
						className={cn(
							"w-40 justify-start text-left font-normal",
							!startDate && "text-muted-foreground",
						)}
					>
						<CalendarIcon className="mr-2 size-4" />
						{startDate
							? format(startDate, "dd/MM/yyyy", { locale: ptBR })
							: "Data início"}
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-auto p-0" align="start">
					<Calendar
						mode="single"
						selected={startDate}
						onSelect={date => {
							onStartDateChange(date);
							setStartOpen(false);
						}}
						locale={ptBR}
						autoFocus
					/>
				</PopoverContent>
			</Popover>

			<span className="text-sm text-muted-foreground">até</span>

			<Popover open={endOpen} onOpenChange={setEndOpen}>
				<PopoverTrigger asChild>
					<Button
						variant="outline"
						size="sm"
						className={cn(
							"w-40 justify-start text-left font-normal",
							!endDate && "text-muted-foreground",
						)}
					>
						<CalendarIcon className="mr-2 size-4" />
						{endDate
							? format(endDate, "dd/MM/yyyy", { locale: ptBR })
							: "Data fim"}
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-auto p-0" align="start">
					<Calendar
						mode="single"
						selected={endDate}
						onSelect={date => {
							onEndDateChange(date);
							setEndOpen(false);
						}}
						locale={ptBR}
						autoFocus
					/>
				</PopoverContent>
			</Popover>
		</div>
	);
}

export { DateRangePicker };
