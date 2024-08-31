import {
	FaRegFileAlt,
	FaFileCode,
	FaFileAlt,
	FaFileUpload,
	FaFileDownload,
	FaPlay,
} from "react-icons/fa";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import { ChangeEvent } from "react";

interface SidebarProps {
	onToggleFiles: () => void;
	onAddFile: (name: string, type: "html" | "css" | "javascript") => void;
	onImport: (
		importedFiles: {
			name: string;
			content: string;
			type: "html" | "css" | "javascript";
		}[]
	) => void;
	onExport: () => void;
	onRun: () => void;
}

export default function Sidebar({
	onToggleFiles,
	onAddFile,
	onImport,
	onExport,
	onRun,
}: SidebarProps) {
	const handleAddFile = (type: "html" | "css" | "javascript") => {
		const name = prompt(
			`Enter the name for the new ${type.toUpperCase()} file:`
		);
		if (name) {
			onAddFile(name, type);
		}
	};

	const handleImportFiles = (event: ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) return;

		const reader = new FileReader();
		reader.onload = (e) => {
			try {
				const importedFiles = JSON.parse(e.target?.result as string);
				onImport(importedFiles);
			} catch (error) {
				console.error("Error importing files:", error);
				alert(
					"Failed to import files. Please make sure the file is valid."
				);
			}
		};
		reader.readAsText(file);
	};

	return (
		<div className="flex flex-col items-center space-y-4 bg-gray-900 text-white p-4 h-screen">
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
				<FaFileCode size={36} />
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
				<FaFileAlt size={36} />
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
				<FaFileAlt size={36} />
			</button>
			<Tooltip id="tooltip-add-js" place="right">
				Add JS File
			</Tooltip>

			<label
				htmlFor="file-upload"
				data-tooltip-id="tooltip-import"
				className="hover:bg-gray-700 p-2 rounded-md cursor-pointer"
			>
				<FaFileUpload size={36} />
			</label>
			<input
				id="file-upload"
				type="file"
				accept=".json"
				onChange={handleImportFiles}
				style={{ display: "none" }}
			/>
			<Tooltip id="tooltip-import" place="right">
				Import Project
			</Tooltip>

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
		</div>
	);
}
