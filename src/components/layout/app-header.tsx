import {
	BarChart3,
	CircleGaugeIcon,
	FileText,
	LayoutDashboard,
	Zap,
} from "lucide-react";
import { Link, useRouterState } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { ModeToggle } from "../mode-toggle";

const navItems = [
	{ to: "/", label: "Dashboard", icon: LayoutDashboard },
	{ to: "/charts", label: "Gráficos", icon: BarChart3 },
	{ to: "/reports", label: "Relatórios", icon: FileText },
	{ to: "/meters", label: "Medidores", icon: CircleGaugeIcon },
] as const;

function AppHeader() {
	const routerState = useRouterState();
	const currentPath = routerState.location.pathname;

	return (
		<header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-sm">
			<div className="mx-auto flex h-14 max-w-7xl items-center gap-6 px-4 w-full">
				<Link to="/" className="flex items-center gap-2 font-bold text-lg">
					<Zap className="size-5 text-yellow-500" />
					<span className="hidden sm:inline">Medidor de Consumo</span>
				</Link>

				<nav className="flex items-center gap-1">
					{navItems.map(item => {
						const isActive =
							item.to === "/"
								? currentPath === "/"
								: currentPath.startsWith(item.to);

						return (
							<Link
								key={item.to}
								to={item.to}
								className={cn(
									"flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
									isActive
										? "bg-primary text-primary-foreground"
										: "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
								)}
							>
								<item.icon className="size-4" />
								<span className="hidden sm:inline">{item.label}</span>
							</Link>
						);
					})}
				</nav>
				<div className="ml-auto">
					<ModeToggle />
				</div>
			</div>
		</header>
	);
}

export { AppHeader };
