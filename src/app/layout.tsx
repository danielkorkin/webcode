import "./globals.css";
import { ReactNode } from "react";

export const metadata = {
	title: "Web VS Code",
	description: "A web-based VS Code-like environment",
};

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="en" suppressHydrationWarning={true}>
			<body>{children}</body>
		</html>
	);
}
