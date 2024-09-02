import React, { useState, useEffect } from "react";

interface SettingsPopupProps {
	isOpen: boolean;
	onClose: () => void;
	onSaveSettings: () => void;
	onDiscardSettings: () => void;
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
	editorVisibility: string;
	onEditorVisibilityChange: (visibility: string) => void;
	projectPassword: string;
	onProjectPasswordChange: (password: string) => void;
	onResetPassword: () => void;
}

export default function SettingsPopup({
	isOpen,
	onClose,
	onSaveSettings,
	onDiscardSettings,
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
	editorVisibility,
	onEditorVisibilityChange,
	projectPassword,
	onProjectPasswordChange,
	onResetPassword,
}: SettingsPopupProps) {
	// Local state for managing changes before saving
	const [localTheme, setLocalTheme] = useState(currentTheme);
	const [localTabSize, setLocalTabSize] = useState(tabSize);
	const [localUseTabs, setLocalUseTabs] = useState(useTabs);
	const [localEditorVisibility, setLocalEditorVisibility] =
		useState(editorVisibility);
	const [localProjectPassword, setLocalProjectPassword] =
		useState(projectPassword);

	// Update local state when props change (when popup is opened)
	useEffect(() => {
		if (isOpen) {
			setLocalTheme(currentTheme);
			setLocalTabSize(tabSize);
			setLocalUseTabs(useTabs);
			setLocalEditorVisibility(editorVisibility);
			setLocalProjectPassword(projectPassword);
		}
	}, [
		isOpen,
		currentTheme,
		tabSize,
		useTabs,
		editorVisibility,
		projectPassword,
	]);

	// Handlers for saving and discarding changes
	const handleSave = () => {
		onThemeChange(localTheme);
		onTabSizeChange(localTabSize);
		onUseTabsChange(localUseTabs);
		onEditorVisibilityChange(localEditorVisibility);
		onProjectPasswordChange(localProjectPassword);
		onSaveSettings(); // Trigger save action
	};

	const handleDiscard = () => {
		onDiscardSettings(); // Trigger discard action
	};

	if (!isOpen) return null;

	const containerClasses =
		localTheme === "vs-dark"
			? "bg-code-gray text-white"
			: "bg-white text-black";
	const selectClasses =
		localTheme === "vs-dark"
			? "bg-gray-700 text-white border-gray-600"
			: "bg-gray-100 text-black border-gray-300";

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
			<div
				className={`p-8 rounded-lg w-96 backdrop-blur-lg shadow-lg ${containerClasses}`}
			>
				<h2 className="text-xl font-bold mb-4">Settings</h2>

				{/* Theme Selection */}
				<div className="mb-4">
					<label className="block text-sm font-medium mb-2">
						Theme
					</label>
					<select
						value={localTheme}
						onChange={(e) => setLocalTheme(e.target.value)}
						className={`mt-1 block w-full p-2 rounded-md shadow-sm ${selectClasses}`}
					>
						<option value="vs-dark">VS Dark</option>
						<option value="vs">VS Light</option>
					</select>
				</div>

				{/* Tab Size Setting */}
				<div className="mb-4">
					<label className="block text-sm font-medium mb-2">
						Tab Size
					</label>
					<input
						type="number"
						value={localTabSize}
						min={1}
						onChange={(e) =>
							setLocalTabSize(Number(e.target.value))
						}
						className={`mt-1 block w-full p-2 rounded-md shadow-sm ${selectClasses}`}
					/>
				</div>

				{/* Use Tabs or Spaces */}
				<div className="mb-4">
					<label className="block text-sm font-medium mb-2">
						Use Tabs
					</label>
					<input
						type="checkbox"
						checked={localUseTabs}
						onChange={(e) => setLocalUseTabs(e.target.checked)}
						className="form-checkbox h-5 w-5 text-blue-600"
					/>
				</div>

				{/* Convert Tabs and Spaces */}
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

				{/* Editor Visibility */}
				<div className="mb-4">
					<label className="block text-sm font-medium mb-2">
						Editor Visibility
					</label>
					<select
						value={localEditorVisibility}
						onChange={(e) =>
							setLocalEditorVisibility(e.target.value)
						}
						className={`mt-1 block w-full p-2 rounded-md shadow-sm ${selectClasses}`}
					>
						<option value="private">Private</option>
						<option value="public-view-only">
							Public View Only
						</option>
						<option value="public">Public</option>
					</select>
				</div>

				{/* Project Password */}
				<div className="mb-4">
					<label className="block text-sm font-medium mb-2">
						Project Password
					</label>
					<input
						type="password"
						value={localProjectPassword}
						onChange={(e) =>
							setLocalProjectPassword(e.target.value)
						}
						className={`mt-1 block w-full p-2 rounded-md shadow-sm ${selectClasses}`}
					/>
					<button
						onClick={onResetPassword}
						className="w-full bg-red-500 text-white px-4 py-2 rounded-md mt-2"
					>
						Reset Password to Default
					</button>
				</div>

				{/* Extensions */}
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
									{extension.enabled && (
										<button
											onClick={() =>
												onExecuteFile(
													extension.value,
													"file-name",
												)
											}
											className="w-full bg-blue-500 text-white px-4 py-2 rounded-md"
										>
											Execute
										</button>
									)}
								</div>
							</li>
						))}
					</ul>
				</div>

				{/* Save and Discard Buttons */}
				<div className="flex justify-between mt-6">
					<button
						onClick={handleDiscard}
						className="bg-gray-500 text-white px-4 py-2 rounded-md"
					>
						Discard
					</button>
					<button
						onClick={handleSave}
						className="bg-blue-500 text-white px-4 py-2 rounded-md"
					>
						Save
					</button>
				</div>
			</div>
		</div>
	);
}
