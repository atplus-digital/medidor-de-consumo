import { CircleGauge } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { MeterFormDialog } from "../meter-form/meter-form-dialog";

export function LoadingState() {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
			<Skeleton className="h-48 w-full" />
			<Skeleton className="h-48 w-full" />
			<Skeleton className="h-48 w-full" />
		</div>
	);
}

export function ErrorState({ onRetry }: { onRetry: () => void }) {
	return (
		<Card>
			<CardContent className="pt-6">
				<div className="text-center text-red-600">
					<p>Erro ao carregar medidores</p>
					<Button
						size="sm"
						variant="outline"
						onClick={onRetry}
						className="mt-2"
					>
						Tentar novamente
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}

export function EmptyState() {
	return (
		<Empty className="bg-muted/30 h-full">
			<EmptyHeader>
				<EmptyMedia variant="icon">
					<CircleGauge className="h-6 w-6" />
				</EmptyMedia>
				<EmptyTitle>Nenhum medidor encontrado</EmptyTitle>
				<EmptyDescription className="max-w-xs text-pretty">
					Crie seu primeiro medidor para começar.
				</EmptyDescription>
			</EmptyHeader>
			<EmptyContent>
				<MeterFormDialog />
			</EmptyContent>
		</Empty>
	);
}
