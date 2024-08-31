import { FaHtml5, FaCss3Alt, FaJsSquare, FaRegFileAlt } from "react-icons/fa";

interface FileTabsProps {
	openFiles: {
		name: string;
		content: string;
		type: "html" | "css" | "javascript";
	}[];
	activeFile: number | null;
	onSelectFile: (index: number) => void;
	onCloseFile: (index: number) => void;
	theme: string;
}

export default function FileTabs({
	openFiles,
	activeFile,
	onSelectFile,
	onCloseFile,
	theme,
}: FileTabsProps) {
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
										? "bg-code-grack text-white"
										: "bg-gray-200 text-black"
									: theme === "vs-dark"
									? "bg-gray-700 text-white"
									: "bg-gray-100 text-black"
							}`}
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
