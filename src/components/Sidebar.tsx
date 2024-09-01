import {
	FaRegFileAlt,
	FaHtml5,
	FaCss3Alt,
	FaJsSquare,
	FaStore,
	FaUpload,
	FaDownload,
	FaPlay,
	FaCog,
	FaFileDownload,
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
	theme: string;
	extensions: any[];
	onOpenExtensionUI: (uiFile: string) => void;
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
	theme,
	extensions,
	onOpenExtensionUI,
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
			<button
				type="button"
				data-tooltip-id="tooltip-files"
				onClick={onToggleFiles}
				className={`p-2 rounded-md ${theme === "vs-dark" ? "hover:bg-gray-700" : "hover:bg-gray-200"}`}
			>
				<FaRegFileAlt size={36} />
			</button>
			<Tooltip id="tooltip-files" place="right">
				Toggle Files
			</Tooltip>

			<button
				type="button"
				data-tooltip-id="tooltip-add-html"
				onClick={() => handleAddFile("html")}
				className={`p-2 rounded-md ${theme === "vs-dark" ? "hover:bg-gray-700" : "hover:bg-gray-200"}`}
			>
				<FaHtml5 size={36} />
			</button>
			<Tooltip id="tooltip-add-html" place="right">
				Add HTML File
			</Tooltip>

			<button
				type="button"
				data-tooltip-id="tooltip-add-css"
				onClick={() => handleAddFile("css")}
				className={`p-2 rounded-md ${theme === "vs-dark" ? "hover:bg-gray-700" : "hover:bg-gray-200"}`}
			>
				<FaCss3Alt size={36} />
			</button>
			<Tooltip id="tooltip-add-css" place="right">
				Add CSS File
			</Tooltip>

			<button
				type="button"
				data-tooltip-id="tooltip-add-js"
				onClick={() => handleAddFile("javascript")}
				className={`p-2 rounded-md ${theme === "vs-dark" ? "hover:bg-gray-700" : "hover:bg-gray-200"}`}
			>
				<FaJsSquare size={36} />
			</button>
			<Tooltip id="tooltip-add-js" place="right">
				Add JS File
			</Tooltip>

			<button
				type="button"
				data-tooltip-id="tooltip-marketplace"
				onClick={onOpenMarketplace}
				className={`p-2 rounded-md ${theme === "vs-dark" ? "hover:bg-gray-700" : "hover:bg-gray-200"}`}
			>
				<FaStore size={36} />
			</button>
			<Tooltip id="tooltip-marketplace" place="right">
				Marketplace
			</Tooltip>

			<button
				type="button"
				data-tooltip-id="tooltip-import-settings"
				onClick={onImportSettings}
				className={`p-2 rounded-md ${theme === "vs-dark" ? "hover:bg-gray-700" : "hover:bg-gray-200"}`}
			>
				<FaUpload size={36} />
			</button>
			<Tooltip id="tooltip-import-settings" place="right">
				Import Settings
			</Tooltip>

			<button
				type="button"
				data-tooltip-id="tooltip-export-settings"
				onClick={onExportSettings}
				className={`p-2 rounded-md ${theme === "vs-dark" ? "hover:bg-gray-700" : "hover:bg-gray-200"}`}
			>
				<FaDownload size={36} />
			</button>
			<Tooltip id="tooltip-export-settings" place="right">
				Export Settings
			</Tooltip>

			<ImportButton onImport={onImport} theme={theme} />

			<button
				type="button"
				data-tooltip-id="tooltip-export"
				onClick={onExport}
				className={`p-2 rounded-md ${theme === "vs-dark" ? "hover:bg-gray-700" : "hover:bg-gray-200"}`}
			>
				<FaFileDownload size={36} />
			</button>
			<Tooltip id="tooltip-export" place="right">
				Export Project
			</Tooltip>

			<button
				type="button"
				data-tooltip-id="tooltip-run"
				onClick={onRun}
				className={`p-2 rounded-md mt-auto ${theme === "vs-dark" ? "hover:bg-gray-700" : "hover:bg-gray-200"}`}
			>
				<FaPlay size={36} />
			</button>
			<Tooltip id="tooltip-run" place="right">
				Run Project
			</Tooltip>

			<button
				type="button"
				data-tooltip-id="tooltip-settings"
				onClick={onOpenSettings}
				className={`p-2 rounded-md ${theme === "vs-dark" ? "hover:bg-gray-700" : "hover:bg-gray-200"}`}
			>
				<FaCog size={36} />
			</button>
			<Tooltip id="tooltip-settings" place="right">
				Settings
			</Tooltip>

			{extensions.map((extension) => {
				if (extension.uiFile) {
					return (
						<button
							key={extension.value}
							type="button"
							data-tooltip-id={`tooltip-${extension.value}`}
							onClick={() => onOpenExtensionUI(extension.uiFile)}
							className={`p-2 rounded-md ${theme === "vs-dark" ? "hover:bg-gray-700" : "hover:bg-gray-200"}`}
						>
							<img
								src={extension.icon}
								alt={extension.title}
								className="h-8 w-8"
							/>
						</button>
					);
				}
				return null;
			})}
		</div>
	);
}
