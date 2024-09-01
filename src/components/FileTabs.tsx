import { FaHtml5, FaCss3Alt, FaJsSquare, FaRegFileAlt } from "react-icons/fa";
import { useState, useEffect, useRef } from "react";
import {
	draggable,
	dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { reorder } from "@atlaskit/pragmatic-drag-and-drop/reorder";

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
	onDeleteFile: (index: number) => void; // New prop for deleting files
	onCloseOthers: (index: number) => void;
	onCloseRight: (index: number) => void;
	onReorderFiles: (newOrder: any[]) => void;
	theme: string;
}

export default function FileTabs({
	openFiles = [],
	activeFile = null,
	onSelectFile,
	onCloseFile,
	onDownloadFile,
	onDeleteFile, // New prop
	onCloseOthers,
	onCloseRight,
	onReorderFiles,
	theme,
}: FileTabsProps) {
	const [contextMenu, setContextMenu] = useState<{
		index: number;
		x: number;
		y: number;
	} | null>(null);
	const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
	const [deleteIndex, setDeleteIndex] = useState<number | null>(null); // Track which file to delete

	const tabsRef = useRef<HTMLDivElement | null>(null);

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

	useEffect(() => {
		if (!tabsRef.current) return;

		const elements = tabsRef.current.querySelectorAll(
			"[data-draggable-id]",
		);

		const unmonitors = Array.from(elements).map((element, index) => {
			return draggable({
				element,
				getInitialData: () => ({ index }),
				canDrag: ({ input }) => {
					// Lock drag movement to horizontal axis
					return Math.abs(input.clientY - input.pageY) < 10;
				},
			});
		});

		const unmonitorsForElements = Array.from(elements).map(
			(element, index) => {
				return dropTargetForElements({
					element,
					getData: () => ({ index }),
					getIsSticky: () => true, // Allow stickiness for better interaction
					canDrop: ({ source }) => {
						// Only allow dropping in adjacent positions
						const sourceIndex = source.data.index;
						return Math.abs(sourceIndex - index) === 1;
					},
					onDrop: ({ location, source }) => {
						if (!location.current.dropTargets.length) {
							return;
						}
						const targetIndex =
							location.current.dropTargets[0].data.index;
						const sourceIndex = source.data.index;

						if (targetIndex !== sourceIndex) {
							const reorderedFiles = reorder({
								list: openFiles,
								startIndex: sourceIndex,
								finishIndex: targetIndex,
							});
							onReorderFiles(reorderedFiles);
							onSelectFile(targetIndex); // Keep the current tab selected
						}
					},
				});
			},
		);

		return () => {
			unmonitors.forEach((unmonitor) => unmonitor());
			unmonitorsForElements.forEach((unmonitor) => unmonitor());
		};
	}, [openFiles, onReorderFiles, onSelectFile]);

	return (
		<>
			<div
				className="mb-4 flex border-b border-gray-300 relative"
				ref={tabsRef}
			>
				{openFiles.map((file, index) => (
					<div
						key={file.name}
						data-draggable-id={index}
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
						onClick={() => onSelectFile(index)}
						style={{ cursor: "grab" }}
					>
						{getFileIcon(file.type)}
						{file.name}
						<button
							type="button"
							className="ml-2 text-sm text-red-500"
							onClick={(e) => {
								e.stopPropagation();
								handleClose(index);
							}}
						>
							X
						</button>
					</div>
				))}

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
							onClick={() => handleDelete(contextMenu.index)}
							className={`block w-full text-left p-2 text-red-500 ${
								theme === "vs-dark"
									? "hover:bg-gray-700"
									: "hover:bg-gray-200"
							}`}
						>
							Delete
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
