interface FileTabsProps {
	openFiles: {
		name: string;
		content: string;
		type: "html" | "css" | "javascript";
	}[];
	activeFile: number | null;
	onSelectFile: (index: number) => void;
	onCloseFile: (index: number) => void;
	theme: string; // Add theme prop
}

export default function FileTabs({
	openFiles,
	activeFile,
	onSelectFile,
	onCloseFile,
	theme, // Receive theme prop
}: FileTabsProps) {
	return (
		<div className="mb-4 flex border-b border-gray-300">
			{openFiles.map(
				(file, index) =>
					file && (
						<div
							key={file.name}
							className={`p-2 mr-2 rounded-t-md flex items-center ${
								activeFile === index
									? theme === "vs-dark"
										? "bg-gray-800 text-white"
										: "bg-gray-200 text-black"
									: theme === "vs-dark"
									? "bg-gray-700 text-white"
									: "bg-gray-100 text-black"
							}`}
						>
							<button
								type="button"
								className="mr-2"
								onClick={() => onSelectFile(index)}
							>
								{file.name}
							</button>
							<button
								type="button"
								className="text-sm text-red-500"
								onClick={() => onCloseFile(index)}
							>
								X
							</button>
						</div>
					)
			)}
		</div>
	);
}
