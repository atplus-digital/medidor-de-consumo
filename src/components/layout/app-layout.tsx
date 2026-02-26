import { AppHeader } from "./app-header";

function AppLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="min-h-screen bg-background text-foreground">
			<AppHeader />
			<main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
		</div>
	);
}

export { AppLayout };
