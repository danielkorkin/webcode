// src/components/Settings.tsx

import { useState } from "react";
import { lightTheme, darkTheme } from "@/themes";

interface SettingsProps {
	onClose: () => void;
	onThemeChange: (theme: any) => void;
	currentTheme: any;
}

export default function Settings({
	onClose,
	onThemeChange,
	currentTheme,
}: SettingsProps) {
	const [selectedTheme, setSelectedTheme] = useState(currentTheme);

	const handleThemeChange = (theme: any) => {
		setSelectedTheme(theme);
		onThemeChange(theme);
	};

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
			<div
				className="p-6 rounded-lg shadow-lg w-96"
				style={{
					backgroundColor:
						selectedTheme.name === "dark"
							? darkTheme.sidebarBackgroundColor
							: lightTheme.sidebarBackgroundColor,
				}}
			>
				<h2
					className="text-xl font-bold mb-4"
					style={{ color: selectedTheme.textColor }}
				>
					Settings
				</h2>
				<div className="mb-4">
					<h3
						className="text-lg font-semibold mb-2"
						style={{ color: selectedTheme.textColor }}
					>
						Theme
					</h3>
					<button
						onClick={() => handleThemeChange(darkTheme)}
						className={`p-2 w-full mb-2 rounded ${
							selectedTheme.name === "dark"
								? "bg-gray-800 text-white"
								: "bg-gray-200 text-black"
						}`}
					>
						Classic Dark
					</button>
					<button
						onClick={() => handleThemeChange(lightTheme)}
						className={`p-2 w-full rounded ${
							selectedTheme.name === "light"
								? "bg-gray-200 text-black"
								: "bg-gray-800 text-white"
						}`}
					>
						Classic Light
					</button>
				</div>
				<button
					onClick={onClose}
					className="mt-4 p-2 rounded-md w-full"
					style={{ backgroundColor: "#007ACC", color: "#FFFFFF" }}
				>
					Close
				</button>
			</div>
		</div>
	);
}
