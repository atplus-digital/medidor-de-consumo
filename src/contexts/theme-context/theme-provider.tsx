import { useEffect, useState } from "react";
import { ThemeProviderContext } from "./theme-context";

export type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
	children: React.ReactNode;
	defaultTheme?: Theme;
	storageKey?: string;
};

export function ThemeProvider({
	children,
	defaultTheme = "system",
	storageKey = "vite-ui-theme",
}: ThemeProviderProps) {
	function getStoredUserTheme(): Theme {
		if (typeof window === "undefined") return defaultTheme;
		try {
			const stored = localStorage.getItem(storageKey);
			return stored && ["light", "dark", "system"].includes(stored)
				? (stored as Theme)
				: defaultTheme;
		} catch {
			return defaultTheme;
		}
	}

	const [theme, setTheme] = useState<Theme>(() => getStoredUserTheme());

	function setStoredTheme(theme: Theme): void {
		if (typeof window === "undefined") return;
		try {
			localStorage.setItem(storageKey, theme);
		} catch {}
	}

	useEffect(() => {
		const root = window.document.documentElement;

		root.classList.remove("light", "dark");

		if (theme === "system") {
			const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
				.matches
				? "dark"
				: "light";

			root.classList.add(systemTheme);
			return;
		}

		root.classList.add(theme);
	}, [theme]);

	const toggleTheme = () => {
		const newTheme: Theme = theme === "light" ? "dark" : "light";
		setStoredTheme(newTheme);
		setTheme(newTheme);
	};

	const value = {
		theme,
		setTheme: (theme: Theme) => {
			setStoredTheme(theme);
			setTheme(theme);
		},
		toggleTheme,
	};

	return (
		<ThemeProviderContext.Provider value={value}>
			{children}
		</ThemeProviderContext.Provider>
	);
}
