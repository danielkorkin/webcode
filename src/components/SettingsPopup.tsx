// src/components/SettingsPopup.tsx
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

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
			<div className="bg-white dark:bg-gray-800 p-8 rounded-lg w-96">
				<h2 className="text-xl font-bold mb-4 dark:text-white">
					Settings
				</h2>
				<div className="mb-4">
					<label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
						Theme
					</label>
					<select
						value={currentTheme}
						onChange={(e) => onThemeChange(e.target.value)}
						className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm dark:bg-gray-700 dark:text-white"
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
