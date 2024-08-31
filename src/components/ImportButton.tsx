import { useRef } from "react";
import { FaFileUpload } from "react-icons/fa";

interface ImportButtonProps {
	onImport: (
		files: {
			name: string;
			content: string;
			type: "html" | "css" | "javascript";
		}[]
	) => void;
}

export default function ImportButton({ onImport }: ImportButtonProps) {
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const fileReader = new FileReader();
		const file = event.target.files?.[0];
		if (file) {
			fileReader.onload = (e) => {
				const content = e.target?.result as string;
				const importedFiles = JSON.parse(content);
				onImport(importedFiles);
			};
			fileReader.readAsText(file);
		}
	};

	const handleClick = () => {
		if (fileInputRef.current) {
			fileInputRef.current.click();
		}
	};

	return (
		<>
			<button
				type="button"
				className="hover:bg-gray-700 p-2 rounded-md"
				onClick={handleClick}
			>
				<FaFileUpload size={36} />
			</button>
			<input
				type="file"
				ref={fileInputRef}
				style={{ display: "none" }}
				accept=".json"
				onChange={handleFileUpload}
			/>
		</>
	);
}
