import React from "react";

interface SettingsPopupProps {
	isOpen: boolean;
	onClose: () => void;
	onThemeChange: (theme: string) => void;
	currentTheme: string;
}

export default function SettingsPopup({
	isOpen,
	onClose,
	onThemeChange,
	currentTheme,
}: SettingsPopupProps) {
	if (!isOpen) return null;

	// Dynamically set classes based on the theme
	const containerClasses =
		currentTheme === "vs-dark"
			? "bg-code-grack text-white"
			: "bg-white text-black";
	const selectClasses =
		currentTheme === "vs-dark"
			? "bg-gray-700 text-white border-gray-600"
			: "bg-gray-100 text-black border-gray-300";

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
			<div
				className={`p-8 rounded-lg w-96 backdrop-blur-lg shadow-lg ${containerClasses}`}
			>
				<h2 className="text-xl font-bold mb-4">Settings</h2>
				<div className="mb-4">
					<label className="block text-sm font-medium mb-2">
						Theme
					</label>
					<select
						value={currentTheme}
						onChange={(e) => onThemeChange(e.target.value)}
						className={`mt-1 block w-full p-2 rounded-md shadow-sm ${selectClasses}`}
					>
						<option value="vs-dark">VS Dark</option>
						<option value="vs">VS Light</option>
					</select>
				</div>
				<button
					onClick={onClose}
					className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md"
				>
					Close
				</button>
			</div>
		</div>
	);
}
