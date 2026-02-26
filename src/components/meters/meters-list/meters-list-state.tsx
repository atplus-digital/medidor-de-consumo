import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type ErrorStateProps = {
	onRetry: () => void;
};

export function LoadingState() {
	return <div className="text-center py-8">Loading meters...</div>;
}

export function ErrorState({ onRetry }: ErrorStateProps) {
	return (
		<Card>
			<CardContent className="pt-6">
				<div className="text-center text-red-600">
					<p>Error loading meters</p>
					<Button
						size="sm"
						variant="outline"
						onClick={onRetry}
						className="mt-2"
					>
						Retry
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}

export function EmptyState() {
	return (
		<Card>
			<CardContent className="pt-6 text-center text-muted-foreground">
				No meters found. Create your first meter to get started.
			</CardContent>
		</Card>
	);
}
