import "./globals.css";
import { ReactNode } from "react";

export const metadata = {
	title: "WebCode",
	description: "A web-based for web development (with html, css, and js) code editor",
};

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="en" suppressHydrationWarning={true}>
			<body>{children}</body>
		</html>
	);
}
