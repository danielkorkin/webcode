import { FaHtml5, FaCss3Alt, FaJsSquare, FaRegFileAlt } from "react-icons/fa";
import { useState, useEffect } from "react";

interface FileTabsProps {
	openFiles: {
		name: string;
		content: string;
		type: "html" | "css" | "javascript";
	}[];
	activeFile: number | null;
	onSelectFile: (index: number) => void;
	onCloseFile: (index: number) => void;
	onDownloadFile: (index: number) => void;
	onCloseOthers: (index: number) => void;
	onCloseRight: (index: number) => void;
	theme: string;
}

export default function FileTabs({
	openFiles,
	activeFile,
	onSelectFile,
	onCloseFile,
	onDownloadFile,
	onCloseOthers,
	onCloseRight,
	theme,
}: FileTabsProps) {
	const [contextMenu, setContextMenu] = useState<{
		index: number;
		x: number;
		y: number;
	} | null>(null);

	useEffect(() => {
		const handleClickOutside = () => {
			setContextMenu(null);
		};

		window.addEventListener("click", handleClickOutside);
		return () => {
			window.removeEventListener("click", handleClickOutside);
		};
	}, []);

	const handleRightClick = (event: React.MouseEvent, index: number) => {
		event.preventDefault();
		setContextMenu({ index, x: event.clientX, y: event.clientY });
	};

	const handleClose = (index: number) => {
		onCloseFile(index);
		setContextMenu(null);
	};

	const handleDownload = (index: number) => {
		onDownloadFile(index);
		setContextMenu(null);
	};

	const handleCloseOthers = (index: number) => {
		onCloseOthers(index);
		setContextMenu(null);
	};

	const handleCloseRight = (index: number) => {
		onCloseRight(index);
		setContextMenu(null);
	};

	return (
		<div className="mb-4 flex border-b border-gray-300 relative">
			{openFiles.map(
				(file, index) =>
					file && (
						<div
							key={file.name}
							className={`p-2 mr-2 rounded-t-md flex items-center ${
								activeFile === index
									? theme === "vs-dark"
										? "bg-code-grack text-white"
										: "bg-gray-200 text-black"
									: theme === "vs-dark"
										? "bg-gray-700 text-white"
										: "bg-gray-100 text-black"
							}`}
							onContextMenu={(event) =>
								handleRightClick(event, index)
							}
						>
							<button
								type="button"
								className="flex items-center"
								onClick={() => onSelectFile(index)}
							>
								{getFileIcon(file.type)}
								{file.name}
							</button>
							<button
								type="button"
								className="ml-2 text-sm text-red-500"
								onClick={() => handleClose(index)}
							>
								X
							</button>
						</div>
					),
			)}

			{contextMenu && (
				<div
					className={`fixed z-50 ${
						theme === "vs-dark"
							? "bg-gray-800 text-white"
							: "bg-white text-black"
					} border shadow-lg p-2 rounded-md`}
					style={{ top: contextMenu.y, left: contextMenu.x }}
				>
					<button
						onClick={() => handleDownload(contextMenu.index)}
						className={`block w-full text-left p-2 ${
							theme === "vs-dark"
								? "hover:bg-gray-700"
								: "hover:bg-gray-200"
						}`}
					>
						Download
					</button>
					<button
						onClick={() => handleClose(contextMenu.index)}
						className={`block w-full text-left p-2 ${
							theme === "vs-dark"
								? "hover:bg-gray-700"
								: "hover:bg-gray-200"
						}`}
					>
						Close Tab
					</button>
					<button
						onClick={() => handleCloseOthers(contextMenu.index)}
						className={`block w-full text-left p-2 ${
							theme === "vs-dark"
								? "hover:bg-gray-700"
								: "hover:bg-gray-200"
						}`}
					>
						Close Other Tabs
					</button>
					<button
						onClick={() => handleCloseRight(contextMenu.index)}
						className={`block w-full text-left p-2 ${
							theme === "vs-dark"
								? "hover:bg-gray-700"
								: "hover:bg-gray-200"
						}`}
					>
						Close Tabs to the Right
					</button>
				</div>
			)}
		</div>
	);
}

function getFileIcon(type: string) {
	switch (type) {
		case "html":
			return <FaHtml5 className="mr-2" />;
		case "css":
			return <FaCss3Alt className="mr-2" />;
		case "javascript":
			return <FaJsSquare className="mr-2" />;
		default:
			return <FaRegFileAlt className="mr-2" />;
	}
}
