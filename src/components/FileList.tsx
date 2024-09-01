import { FaHtml5, FaCss3Alt, FaJsSquare, FaRegFileAlt } from "react-icons/fa";
import { useState, useEffect } from "react";

interface FileListProps {
	files: {
		name: string;
		content: string;
		type: "html" | "css" | "javascript";
	}[];
	onOpenFile: (index: number) => void;
	onRenameFile: (index: number, newName: string) => void;
	onDownloadFile: (index: number) => void;
	theme: string;
}

export default function FileList({
	files,
	onOpenFile,
	onRenameFile,
	onDownloadFile,
	theme,
}: FileListProps) {
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

	const handleRename = (index: number) => {
		const newName = prompt("Enter the new file name:");
		if (newName) {
			onRenameFile(index, newName);
		}
		setContextMenu(null);
	};

	const handleDownload = (index: number) => {
		onDownloadFile(index);
		setContextMenu(null);
	};

	return (
		<div
			className={`w-64 h-screen p-4 shadow-lg ${
				theme === "vs-dark"
					? "bg-code-grack text-white"
					: "bg-code-gray-100 text-black"
			}`}
		>
			<h3 className="text-lg font-bold mb-4">Files</h3>
			<ul className="mb-4">
				{files.map((file, index) => (
					<li
						key={file.name}
						className={`cursor-pointer mb-2 p-2 rounded-md flex items-center ${
							theme === "vs-dark"
								? "hover:bg-gray-700"
								: "hover:bg-gray-200"
						}`}
						onClick={() => onOpenFile(index)}
						onContextMenu={(event) =>
							handleRightClick(event, index)
						}
					>
						{getFileIcon(file.type)}
						{file.name}
					</li>
				))}
			</ul>

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
						onClick={() => handleRename(contextMenu.index)}
						className={`block w-full text-left p-2 ${
							theme === "vs-dark"
								? "hover:bg-gray-700"
								: "hover:bg-gray-200"
						}`}
					>
						Rename
					</button>
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
