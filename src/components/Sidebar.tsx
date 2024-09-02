import {
	FaRegFileAlt,
	FaFileCode,
	FaFileAlt,
	FaFileUpload,
	FaFileDownload,
	FaPlay,
	FaCog,
	FaHtml5,
	FaCss3Alt,
	FaJsSquare,
	FaStore,
	FaDownload,
	FaUpload,
	FaSave, // <-- Icon for save button
} from "react-icons/fa";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import ImportButton from "@/components/ImportButton";

interface SidebarProps {
	onToggleFiles: () => void;
	onAddFile: (name: string, type: "html" | "css" | "javascript") => void;
	onImport: (
		files: {
			name: string;
			content: string;
			type: "html" | "css" | "javascript";
		}[],
	) => void;
	onExport: () => void;
	onRun: () => void;
	onOpenSettings: () => void;
	onOpenMarketplace: () => void;
	onImportSettings: () => void;
	onExportSettings: () => void;
	onSave: () => void; // <-- New prop for manual save
	theme: string;
}

export default function Sidebar({
	onToggleFiles,
	onAddFile,
	onImport,
	onExport,
	onRun,
	onOpenSettings,
	onOpenMarketplace,
	onImportSettings,
	onExportSettings,
	onSave, // <-- Use the new prop
	theme,
}: SidebarProps) {
	const handleAddFile = (type: "html" | "css" | "javascript") => {
		const name = prompt(
			`Enter the name for the new ${type.toUpperCase()} file:`,
		);
		if (name) {
			onAddFile(name, type);
		}
	};

	return (
		<div
			className={`flex flex-col items-center space-y-4 p-4 h-screen ${
				theme === "vs-dark"
					? "bg-code-black text-white"
					: "bg-code-gray-200 text-black"
			}`}
		>
			{/* Toggle Files Button */}
			<button
				type="button"
				data-tooltip-id="tooltip-files"
				onClick={onToggleFiles}
				className={`p-2 rounded-md ${
					theme === "vs-dark"
						? "hover:bg-gray-700"
						: "hover:bg-gray-200"
				}`}
			>
				<FaRegFileAlt size={36} />
			</button>
			<Tooltip id="tooltip-files" place="right">
				Toggle Files
			</Tooltip>

			{/* Add HTML File Button */}
			<button
				type="button"
				data-tooltip-id="tooltip-add-html"
				onClick={() => handleAddFile("html")}
				className={`p-2 rounded-md ${
					theme === "vs-dark"
						? "hover:bg-gray-700"
						: "hover:bg-gray-200"
				}`}
			>
				<FaHtml5 size={36} />
			</button>
			<Tooltip id="tooltip-add-html" place="right">
				Add HTML File
			</Tooltip>

			{/* Add CSS File Button */}
			<button
				type="button"
				data-tooltip-id="tooltip-add-css"
				onClick={() => handleAddFile("css")}
				className={`p-2 rounded-md ${
					theme === "vs-dark"
						? "hover:bg-gray-700"
						: "hover:bg-gray-200"
				}`}
			>
				<FaCss3Alt size={36} />
			</button>
			<Tooltip id="tooltip-add-css" place="right">
				Add CSS File
			</Tooltip>

			{/* Add JS File Button */}
			<button
				type="button"
				data-tooltip-id="tooltip-add-js"
				onClick={() => handleAddFile("javascript")}
				className={`p-2 rounded-md ${
					theme === "vs-dark"
						? "hover:bg-gray-700"
						: "hover:bg-gray-200"
				}`}
			>
				<FaJsSquare size={36} />
			</button>
			<Tooltip id="tooltip-add-js" place="right">
				Add JS File
			</Tooltip>

			{/* Marketplace Button */}
			<button
				type="button"
				data-tooltip-id="tooltip-marketplace"
				onClick={onOpenMarketplace} // <-- Hook up the new marketplace button
				className={`p-2 rounded-md ${
					theme === "vs-dark"
						? "hover:bg-gray-700"
						: "hover:bg-gray-200"
				}`}
			>
				<FaStore size={36} />
			</button>
			<Tooltip id="tooltip-marketplace" place="right">
				Marketplace
			</Tooltip>

			{/* Import Settings Button */}
			<button
				type="button"
				data-tooltip-id="tooltip-import-settings"
				onClick={onImportSettings} // <-- Hook up the new import settings button
				className={`p-2 rounded-md ${
					theme === "vs-dark"
						? "hover:bg-gray-700"
						: "hover:bg-gray-200"
				}`}
			>
				<FaUpload size={36} />
			</button>
			<Tooltip id="tooltip-import-settings" place="right">
				Import Settings
			</Tooltip>

			{/* Export Settings Button */}
			<button
				type="button"
				data-tooltip-id="tooltip-export-settings"
				onClick={onExportSettings} // <-- Hook up the new export settings button
				className={`p-2 rounded-md ${
					theme === "vs-dark"
						? "hover:bg-gray-700"
						: "hover:bg-gray-200"
				}`}
			>
				<FaDownload size={36} />
			</button>
			<Tooltip id="tooltip-export-settings" place="right">
				Export Settings
			</Tooltip>

			{/* Use the ImportButton component for the Import functionality */}
			<ImportButton onImport={onImport} theme={theme} />

			{/* Export Project Button */}
			<button
				type="button"
				data-tooltip-id="tooltip-export"
				onClick={onExport}
				className={`p-2 rounded-md ${
					theme === "vs-dark"
						? "hover:bg-gray-700"
						: "hover:bg-gray-200"
				}`}
			>
				<FaFileDownload size={36} />
			</button>
			<Tooltip id="tooltip-export" place="right">
				Export Project
			</Tooltip>

			{/* Manual Save Button */}
			<button
				type="button"
				data-tooltip-id="tooltip-save"
				onClick={onSave} // <-- Hook up the save button
				className={`p-2 rounded-md ${
					theme === "vs-dark"
						? "hover:bg-gray-700"
						: "hover:bg-gray-200"
				}`}
			>
				<FaSave size={36} />
			</button>
			<Tooltip id="tooltip-save" place="right">
				Save Project
			</Tooltip>

			{/* Run Project Button */}
			<button
				type="button"
				data-tooltip-id="tooltip-run"
				onClick={onRun}
				className={`p-2 rounded-md mt-auto ${
					theme === "vs-dark"
						? "hover:bg-gray-700"
						: "hover:bg-gray-200"
				}`}
			>
				<FaPlay size={36} />
			</button>
			<Tooltip id="tooltip-run" place="right">
				Run Project
			</Tooltip>

			{/* Settings Button */}
			<button
				type="button"
				data-tooltip-id="tooltip-settings"
				onClick={onOpenSettings}
				className={`p-2 rounded-md ${
					theme === "vs-dark"
						? "hover:bg-gray-700"
						: "hover:bg-gray-200"
				}`}
			>
				<FaCog size={36} />
			</button>
			<Tooltip id="tooltip-settings" place="right">
				Settings
			</Tooltip>
		</div>
	);
}
