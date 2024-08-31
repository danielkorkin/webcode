// src/components/Sidebar.tsx
import {
	FaRegFileAlt,
	FaFileCode,
	FaFileAlt,
	FaFileUpload,
	FaFileDownload,
	FaPlay,
	FaCog, // New icon for settings
	FaHtml5,
	FaCss3Alt,
	FaJsSquare
} from "react-icons/fa";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import ImportButton from "@/components/ImportButton"; // Import the ImportButton component

interface SidebarProps {
	onToggleFiles: () => void;
	onAddFile: (name: string, type: "html" | "css" | "javascript") => void;
	onImport: (
		files: {
			name: string;
			content: string;
			type: "html" | "css" | "javascript";
		}[]
	) => void;
	onExport: () => void;
	onRun: () => void;
	onOpenSettings: () => void; // Add function to open settings
	theme: string; // Pass theme to conditionally apply styles
}

export default function Sidebar({
	onToggleFiles,
	onAddFile,
	onImport,
	onExport,
	onRun,
	onOpenSettings, // Function to open settings
	theme,
}: SidebarProps) {
	const handleAddFile = (type: "html" | "css" | "javascript") => {
		const name = prompt(
			`Enter the name for the new ${type.toUpperCase()} file:`
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
					: "bg-white text-black"
			}`}
		>
			<button
				type="button"
				data-tooltip-id="tooltip-files"
				onClick={onToggleFiles}
				className="hover:bg-gray-700 p-2 rounded-md"
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
				className="hover:bg-gray-700 p-2 rounded-md"
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
				className="hover:bg-gray-700 p-2 rounded-md"
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
				className="hover:bg-gray-700 p-2 rounded-md"
			>
				<FaJsSquare size={36} />
			</button>
			<Tooltip id="tooltip-add-js" place="right">
				Add JS File
			</Tooltip>

			{/* Use the ImportButton component for the Import functionality */}
			<ImportButton onImport={onImport} />

			<button
				type="button"
				data-tooltip-id="tooltip-export"
				onClick={onExport}
				className="hover:bg-gray-700 p-2 rounded-md"
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
				className="hover:bg-gray-700 p-2 rounded-md mt-auto"
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
				className="hover:bg-gray-700 p-2 rounded-md"
			>
				<FaCog size={36} />
			</button>
			<Tooltip id="tooltip-settings" place="right">
				Settings
			</Tooltip>
		</div>
	);
}
