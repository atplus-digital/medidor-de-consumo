import { Outlet } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/app-layout";
import { Toaster } from "@/components/ui/sonner";
import { EnergyFiltersProvider } from "@/contexts/energy-filters-context/energy-filters-context";
import { ThemeProvider } from "@/contexts/theme-context/theme-provider";

function RootContext() {
	return (
		<ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
			<EnergyFiltersProvider>
				<AppLayout>
					<Outlet />
					<Toaster position="top-center" />
				</AppLayout>
			</EnergyFiltersProvider>
		</ThemeProvider>
	);
}

export { RootContext };
