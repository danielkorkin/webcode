import { useRef } from "react";

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
		fileInputRef.current?.click();
	};

	return (
		<>
			<button
				type="button"
				className="p-2 bg-orange-500 text-white rounded-md"
				onClick={handleClick}
			>
				Import Project
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
