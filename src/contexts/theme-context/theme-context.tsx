import { createContext } from "react";
import type { Theme } from "./theme-provider";

type ThemeProviderState = {
	theme: Theme;
	setTheme: (theme: Theme) => void;
	toggleTheme: () => void;
};

const initialState: ThemeProviderState = {
	theme: "system",
	setTheme: () => null,
	toggleTheme: () => null,
};

export const ThemeProviderContext =
	createContext<ThemeProviderState>(initialState);
