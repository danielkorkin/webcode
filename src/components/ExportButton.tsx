interface ExportButtonProps {
	files: {
		name: string;
		content: string;
		type: "html" | "css" | "javascript";
	}[];
}

export default function ExportButton({ files }: ExportButtonProps) {
	const handleExport = () => {
		const dataStr =
			"data:text/json;charset=utf-8," +
			encodeURIComponent(JSON.stringify(files, null, 2));
		const downloadAnchorNode = document.createElement("a");
		downloadAnchorNode.setAttribute("href", dataStr);
		downloadAnchorNode.setAttribute("download", "project-files.json");
		document.body.appendChild(downloadAnchorNode);
		downloadAnchorNode.click();
		downloadAnchorNode.remove();
	};

	return (
		<button
			type="button"
			className="p-2 bg-purple-500 text-white rounded-md"
			onClick={handleExport}
		>
			Export Project
		</button>
	);
}
