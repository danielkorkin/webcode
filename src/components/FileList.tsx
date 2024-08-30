interface FileListProps {
	onAddFile: (name: string, type: "html" | "css" | "javascript") => void;
}

export default function FileList({ onAddFile }: FileListProps) {
	const handleAddFile = (type: "html" | "css" | "javascript") => {
		const name = prompt(
			`Enter the name for the new ${type.toUpperCase()} file:`
		);
		if (name) {
			onAddFile(name, type);
		}
	};

	return (
		<div className="mb-4">
			<button
				type="button"
				className="p-2 bg-green-500 text-white rounded-md mr-2"
				onClick={() => handleAddFile("html")}
			>
				Add HTML File
			</button>
			<button
				type="button"
				className="p-2 bg-blue-500 text-white rounded-md mr-2"
				onClick={() => handleAddFile("css")}
			>
				Add CSS File
			</button>
			<button
				type="button"
				className="p-2 bg-yellow-500 text-white rounded-md"
				onClick={() => handleAddFile("javascript")}
			>
				Add JS File
			</button>
		</div>
	);
}
