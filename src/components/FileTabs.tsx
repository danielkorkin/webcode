interface FileTabsProps {
	files: {
		name: string;
		content: string;
		type: "html" | "css" | "javascript";
	}[];
	activeFile: number | null;
	onSelectFile: (index: number) => void;
}

export default function FileTabs({
	files,
	activeFile,
	onSelectFile,
}: FileTabsProps) {
	return (
		<div className="mb-4">
			{files.map((file, index) => (
				<button
					key={file.name}
					type="button"
					className={`p-2 mr-2 rounded-md ${
						activeFile === index
							? "bg-gray-800 text-white"
							: "bg-gray-200"
					}`}
					onClick={() => onSelectFile(index)}
				>
					{file.name}
				</button>
			))}
		</div>
	);
}
