// src/context/ThemeContext.tsx
import { createContext, useState, useEffect, ReactNode } from "react";

interface ThemeContextProps {
	theme: "vs" | "vs-dark";
	setTheme: (theme: "vs" | "vs-dark") => void;
}

export const ThemeContext = createContext<ThemeContextProps>({
	theme: "vs-dark",
	setTheme: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
	const [theme, setTheme] = useState<"vs" | "vs-dark">(() => {
		// Initialize theme from localStorage if it exists
		if (typeof window !== "undefined") {
			return (
				(localStorage.getItem("theme") as "vs" | "vs-dark") || "vs-dark"
			);
		}
		return "vs-dark"; // Default theme
	});

	useEffect(() => {
		// Save theme to localStorage whenever it changes
		localStorage.setItem("theme", theme);
		document.documentElement.className = theme;
	}, [theme]);

	return (
		<ThemeContext.Provider value={{ theme, setTheme }}>
			{children}
		</ThemeContext.Provider>
	);
}
