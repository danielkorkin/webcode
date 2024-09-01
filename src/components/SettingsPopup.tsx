import React from "react";

interface SettingsPopupProps {
	isOpen: boolean;
	onClose: () => void;
	onThemeChange: (theme: string) => void;
	currentTheme: string;
	extensions: any[];
	onToggleExtension: (title: string) => void;
	onExecuteFile: (extensionTitle: string, file: string) => void;
	openFiles: any[];
	tabSize: number;
	useTabs: boolean;
	onTabSizeChange: (size: number) => void;
	onUseTabsChange: (useTabs: boolean) => void;
	onConvertTabsToSpaces: () => void;
	onConvertSpacesToTabs: () => void;
	onReloadUI: () => void; // New prop for reloading the UI
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
	onReloadUI, // New prop for reloading the UI
}: SettingsPopupProps) {
	if (!isOpen) return null;

	const renderUIComponents = (extension: any) => {
		return extension.uiComponents.map((component: any, index: number) => {
			if (component.type === "button") {
				return (
					<button
						key={index}
						className="bg-blue-500 text-white p-2 rounded-md mt-2"
						onClick={() =>
							onExecuteFile(
								extension.value,
								component.onClickFile,
							)
						}
					>
						{component.label}
					</button>
				);
			} else if (component.type === "select") {
				return (
					<select
						key={index}
						className="bg-gray-200 text-black p-2 rounded-md mt-2"
						onChange={(e) =>
							onExecuteFile(
								extension.value,
								component.onChangeFile,
							)
						}
					>
						{component.options.map(
							(option: string, idx: number) => (
								<option key={idx} value={option}>
									{option}
								</option>
							),
						)}
					</select>
				);
			}
			return null;
		});
	};

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
				<div className="mb-4">
					<button
						onClick={onReloadUI} // Reload UI button
						className="w-full bg-yellow-500 text-white px-4 py-2 rounded-md"
					>
						Reload UI
					</button>
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
