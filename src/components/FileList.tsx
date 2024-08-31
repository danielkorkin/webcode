import { FaRegFileAlt } from "react-icons/fa";

interface FileListProps {
	files: {
		name: string;
		content: string;
		type: "html" | "css" | "javascript";
	}[];
	onOpenFile: (index: number) => void;
	theme: string; // Add theme prop
}

export default function FileList({ files, onOpenFile, theme }: FileListProps) {
	// Ensure files is an array
	if (!Array.isArray(files)) {
		return <div>No files available.</div>;
	}

	return (
		<div
			className={`absolute left-0 top-10 w-64 h-screen p-4 shadow-lg ${
				theme === "vs-dark"
					? "bg-gray-800 text-white"
					: "bg-white text-black"
			}`}
		>
			<h3 className="text-lg font-bold mb-4">Files</h3>
			<ul className="mb-4">
				{files.map((file, index) => (
					<li
						key={file.name}
						className={`cursor-pointer mb-2 p-2 rounded-md ${
							theme === "vs-dark"
								? "hover:bg-gray-700"
								: "hover:bg-gray-200"
						}`}
						onClick={() => onOpenFile(index)}
					>
						{file.name}
					</li>
				))}
			</ul>
		</div>
	);
}
