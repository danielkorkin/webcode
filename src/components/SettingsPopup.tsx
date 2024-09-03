import React from "react";
import { Extension } from "@/types";

interface SettingsPopupProps {
	isOpen: boolean;
	onClose: () => void;
	onThemeChange: (theme: string) => void;
	currentTheme: string;
	extensions: Extension[];
	onToggleExtension: (value: string) => void;
	onExecuteFile: (
		extensionValue: string,
		file: string,
		selectedFileName?: string,
	) => void;
	openFiles: any[];
	tabSize: number;
	useTabs: boolean;
	onTabSizeChange: (size: number) => void;
	onUseTabsChange: (useTabs: boolean) => void;
	onConvertTabsToSpaces: () => void;
	onConvertSpacesToTabs: () => void;
}

export default function SettingsPopup({
	isOpen,
	onClose,
	onThemeChange,
	currentTheme,
	extensions,
	onToggleExtension,
	onExecuteFile,
	openFiles,
	tabSize,
	useTabs,
	onTabSizeChange,
	onUseTabsChange,
	onConvertTabsToSpaces,
	onConvertSpacesToTabs,
}: SettingsPopupProps) {
	if (!isOpen) return null;

	const containerClasses =
		currentTheme === "vs-dark"
			? "bg-code-grack text-white"
			: "bg-white text-black";
	const selectClasses =
		currentTheme === "vs-dark"
			? "bg-gray-700 text-white border-gray-600"
			: "bg-gray-100 text-black border-gray-300";

	const renderUIComponents = (extension: Extension) => {
		return extension.uiComponents.map((component, index) => {
			switch (component.type) {
				case "button":
					return (
						<button
							key={index}
							onClick={() =>
								onExecuteFile(
									extension.value,
									component.onClickFile,
								)
							}
							className="bg-blue-500 text-white px-4 py-2 rounded-md mb-2"
						>
							{component.label}
						</button>
					);
				case "select":
					return (
						<div key={index} className="mb-4">
							<label className="block text-sm font-medium mb-2">
								{component.label}
							</label>
							<select
								defaultValue="" // Set the default value to an empty string
								onChange={(e) =>
									onExecuteFile(
										extension.value,
										component.onChangeFile,
										e.target.value, // Pass the selected file name
									)
								}
								className={`mt-1 block w-full p-2 rounded-md shadow-sm ${selectClasses}`}
							>
								<option value="">No file selected</option>{" "}
								{/* Default option */}
								{openFiles.map((file, i) => (
									<option key={i} value={file.name}>
										{file.name}
									</option>
								))}
							</select>
						</div>
					);
				default:
					return null;
			}
		});
	};

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
				<div className="mb-4">
					<label className="block text-sm font-medium mb-2">
						Tab Size
					</label>
					<input
						type="number"
						value={tabSize}
						min={1}
						onChange={(e) =>
							onTabSizeChange(Number(e.target.value))
						}
						className={`mt-1 block w-full p-2 rounded-md shadow-sm ${selectClasses}`}
					/>
				</div>
				<div className="mb-4">
					<label className="block text-sm font-medium mb-2">
						Use Tabs
					</label>
					<input
						type="checkbox"
						checked={useTabs}
						onChange={(e) => onUseTabsChange(e.target.checked)}
						className="form-checkbox h-5 w-5 text-blue-600"
					/>
				</div>
				<div className="mb-4">
					<button
						onClick={onConvertTabsToSpaces}
						className="w-full bg-blue-500 text-white px-4 py-2 rounded-md mb-2"
					>
						Convert Tabs to Spaces
					</button>
					<button
						onClick={onConvertSpacesToTabs}
						className="w-full bg-blue-500 text-white px-4 py-2 rounded-md"
					>
						Convert Spaces to Tabs
					</button>
				</div>
				<div className="mb-4">
					<h3 className="text-lg font-bold">Extensions</h3>
					<ul>
						{extensions.map((extension) => (
							<li key={extension.value} className="mb-4">
								<div className="flex justify-between">
									<span>{extension.title}</span>
									<button
										className={`text-sm ${
											extension.enabled
												? "bg-red-500"
												: "bg-green-500"
										} text-white p-1 rounded-md`}
										onClick={() =>
											onToggleExtension(extension.value)
										}
									>
										{extension.enabled
											? "Disable"
											: "Enable"}
									</button>
								</div>
								<div className="mt-2">
									{extension.enabled &&
										renderUIComponents(extension)}
								</div>
							</li>
						))}
					</ul>
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
