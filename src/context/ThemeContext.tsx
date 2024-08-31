// src/context/ThemeContext.tsx
import { createContext, useState, useEffect, ReactNode } from "react";

interface ThemeContextProps {
	theme: "light" | "dark";
	setTheme: (theme: "light" | "dark") => void;
}

export const ThemeContext = createContext<ThemeContextProps>({
	theme: "light",
	setTheme: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
	const [theme, setTheme] = useState<"light" | "dark">("light");

	useEffect(() => {
		document.documentElement.className = theme;
	}, [theme]);

	return (
		<ThemeContext.Provider value={{ theme, setTheme }}>
			{children}
		</ThemeContext.Provider>
	);
}
