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
	onDeleteFile: (index: number) => void; // New prop for deleting files
	theme: string;
}

export default function FileList({
	files,
	onOpenFile,
	onRenameFile,
	onDownloadFile,
	onDeleteFile, // New prop
	theme,
}: FileListProps) {
	const [contextMenu, setContextMenu] = useState<{
		index: number;
		x: number;
		y: number;
	} | null>(null);
	const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
	const [deleteIndex, setDeleteIndex] = useState<number | null>(null); // Track which file to delete

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

	const handleDelete = (index: number) => {
		setDeleteIndex(index);
		setIsConfirmDeleteOpen(true);
		setContextMenu(null);
	};

	const confirmDelete = () => {
		if (deleteIndex !== null) {
			onDeleteFile(deleteIndex);
			setIsConfirmDeleteOpen(false);
			setDeleteIndex(null);
		}
	};

	const cancelDelete = () => {
		setIsConfirmDeleteOpen(false);
		setDeleteIndex(null);
	};

	return (
		<>
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
						<button
							onClick={() => handleDelete(contextMenu.index)}
							className={`block w-full text-left p-2 text-red-500 ${
								theme === "vs-dark"
									? "hover:bg-gray-700"
									: "hover:bg-gray-200"
							}`}
						>
							Delete
						</button>
					</div>
				)}
			</div>

			{isConfirmDeleteOpen && (
				<div
					className={`fixed inset-0 flex items-center justify-center z-50 ${
						theme === "vs-dark"
							? "bg-black bg-opacity-50"
							: "bg-gray-700 bg-opacity-50"
					}`}
				>
					<div
						className={`p-4 rounded-lg shadow-lg max-w-sm w-full ${
							theme === "vs-dark"
								? "bg-gray-800 text-white"
								: "bg-white text-black"
						}`}
					>
						<p>Are you sure you want to delete this file?</p>
						<div className="flex justify-end mt-4">
							<button
								className={`mr-2 px-4 py-2 rounded-md ${
									theme === "vs-dark"
										? "bg-gray-700 text-white"
										: "bg-gray-200 text-black"
								}`}
								onClick={cancelDelete}
							>
								Cancel
							</button>
							<button
								className="px-4 py-2 rounded-md bg-red-500 text-white"
								onClick={confirmDelete}
							>
								Delete
							</button>
						</div>
					</div>
				</div>
			)}
		</>
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
