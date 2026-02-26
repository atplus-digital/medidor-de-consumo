import { AppLayout } from "@/components/layout/app-layout";
import { EnergyFiltersProvider } from "@/contexts/energy-filters-context/energy-filters-context";
import { ThemeProvider } from "@/contexts/theme-context/theme-provider";
import { Outlet } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";

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
