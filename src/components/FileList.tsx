import { FaHtml5, FaCss3Alt, FaJsSquare, FaRegFileAlt } from "react-icons/fa";

interface FileListProps {
	files: {
		name: string;
		content: string;
		type: "html" | "css" | "javascript";
	}[];
	onOpenFile: (index: number) => void;
	theme: string;
}

export default function FileList({ files, onOpenFile, theme }: FileListProps) {
	const getFileIcon = (type: string) => {
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
	};

	// Ensure files is an array
	if (!Array.isArray(files)) {
		return <div>No files available.</div>;
	}

	return (
		<div
			className={`w-64 h-screen p-4 shadow-lg ${
				theme === "vs-dark"
					? "bg-code-grack text-white"
					: "bg-white text-black"
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
					>
						{getFileIcon(file.type)}
						{file.name}
					</li>
				))}
			</ul>
		</div>
	);
}
