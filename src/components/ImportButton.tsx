import { useRef, useState } from "react";
import { FaFileUpload } from "react-icons/fa";

interface ImportButtonProps {
	onImport: (
		files: {
			name: string;
			content: string;
			type: "html" | "css" | "javascript";
		}[],
	) => void;
	theme: string; // Add theme prop to control the styles
}

export default function ImportButton({ onImport, theme }: ImportButtonProps) {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [isTooltipVisible, setIsTooltipVisible] = useState(false);

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
		<div
			className="relative inline-block"
			onMouseEnter={() => setIsTooltipVisible(true)}
			onMouseLeave={() => setIsTooltipVisible(false)}
		>
			<button
				type="button"
				className={`p-2 rounded-md ${
					theme === "vs-dark"
						? "hover:bg-gray-700"
						: "hover:bg-gray-200"
				}`}
				onClick={handleClick}
			>
				<FaFileUpload size={36} />
			</button>
			{isTooltipVisible && (
				<div
					className={`absolute left-full top-1/2 transform -translate-y-1/2 ml-2 p-2 rounded-md text-sm ${
						theme === "vs-dark"
							? "bg-gray-800 text-white"
							: "bg-gray-200 text-black"
					}`}
					style={{ whiteSpace: "nowrap" }}
				>
					Import Project
				</div>
			)}
			<input
				type="file"
				ref={fileInputRef}
				style={{ display: "none" }}
				accept=".json"
				onChange={handleFileUpload}
			/>
		</div>
	);
}
