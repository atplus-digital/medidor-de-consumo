import { useContext } from "react";
import {
	DashboardContext,
	type DashboardContextType,
} from "./dashboard-context";

function useDashboard(): DashboardContextType {
	const context = useContext(DashboardContext);
	if (context === undefined) {
		throw new Error("useDashboard must be used within a DashboardProvider");
	}
	return context;
}

export { useDashboard };
