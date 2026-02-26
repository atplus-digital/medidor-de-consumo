import { AppLayout } from "@/components/layout/app-layout";
import { EnergyFiltersProvider } from "@/contexts/energy-filters-context/energy-filters-context";
import { ThemeProvider } from "@/contexts/theme-context/theme-provider";
import { Outlet } from "@tanstack/react-router";
function RootLayout() {
	return (
		<ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
			<EnergyFiltersProvider>
				<AppLayout>
					<Outlet />
				</AppLayout>
			</EnergyFiltersProvider>
		</ThemeProvider>
	);
}

export { RootLayout };
