import React from "react";

interface SettingsPopupProps {
	isOpen: boolean;
	onClose: () => void;
	onThemeChange: (theme: string) => void;
	currentTheme: string;
	extensions: any[];
	onToggleExtension: (title: string) => void;
	onExecuteFile: (extensionTitle: string, file: string) => void;
	openFiles: any[]; // <-- Pass the list of open files
}

export default function SettingsPopup({
	isOpen,
	onClose,
	onThemeChange,
	currentTheme,
	extensions,
	onToggleExtension,
	onExecuteFile,
	openFiles, // <-- Receive open files as a prop
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

	const renderUIComponents = (extension: any) => {
		return extension.uiComponents?.map((component: any, index: number) => {
			switch (component.type) {
				case "button":
					return (
						<div key={index} className="mb-2">
							<button
								className="bg-blue-500 text-white px-4 py-2 rounded-md"
								onClick={() =>
									onExecuteFile(
										extension.value,
										component.onClickFile,
									)
								}
							>
								{component.label}
							</button>
						</div>
					);
				case "select":
					return (
						<div key={index} className="mb-2">
							<label className="block text-sm font-medium mb-1">
								{component.label}
							</label>
							<select
								defaultValue="" // Set a default value
								className={`mt-1 block w-full p-2 rounded-md shadow-sm ${selectClasses}`}
								onChange={(e) =>
									onExecuteFile(
										extension.value,
										component.onChangeFile,
									)
								}
							>
								<option value="" disabled>
									Select a file
								</option>
								{openFiles.map((file, i) => (
									<option key={i} value={file.name}>
										{file.name}
									</option>
								))}
							</select>
						</div>
					);
				case "textInput":
					return (
						<div key={index} className="mb-2">
							<label className="block text-sm font-medium mb-1">
								{component.label}
							</label>
							<input
								type="text"
								className={`mt-1 block w-full p-2 rounded-md shadow-sm ${selectClasses}`}
								onChange={(e) =>
									onExecuteFile(
										extension.value,
										component.onChangeFile,
									)
								}
							/>
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
