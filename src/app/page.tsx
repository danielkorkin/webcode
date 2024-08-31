"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import CodeEditor from "@/components/CodeEditor";
import FileList from "@/components/FileList";
import RunButton from "@/components/RunButton";
import FileTabs from "@/components/FileTabs";
import ExportButton from "@/components/ExportButton";
import ImportButton from "@/components/ImportButton";

export default function Home() {
	const [files, setFiles] = useState<
		{ name: string; content: string; type: "html" | "css" | "javascript" }[]
	>([]);
	const [activeFile, setActiveFile] = useState<number | null>(null);
	const router = useRouter();

	const handleAddFile = (
		name: string,
		type: "html" | "css" | "javascript"
	) => {
		setFiles([...files, { name, content: "", type }]);
		setActiveFile(files.length); // Set the new file as active
	};

	const handleFileChange = (index: number, content: string) => {
		const updatedFiles = [...files];
		updatedFiles[index].content = content;
		setFiles(updatedFiles);
	};

	const handleRun = () => {
		const slug = uuidv4();
		localStorage.setItem(slug, JSON.stringify(files));
		router.push(`/result/${slug}`);
	};

	const handleImport = (
		importedFiles: {
			name: string;
			content: string;
			type: "html" | "css" | "javascript";
		}[]
	) => {
		setFiles(importedFiles);
		setActiveFile(importedFiles.length > 0 ? 0 : null); // Set the first file as active if available
	};

	return (
		<div className="container mx-auto p-4">
			<h1 className="text-3xl font-bold mb-4">Web VS Code</h1>
			<div className="mb-4 flex space-x-4">
				<FileList onAddFile={handleAddFile} />
				<ExportButton files={files} />
				<ImportButton onImport={handleImport} />
			</div>
			<FileTabs
				files={files}
				activeFile={activeFile}
				onSelectFile={setActiveFile}
			/>
			{activeFile !== null && (
				<CodeEditor
					language={files[activeFile].type}
					content={files[activeFile].content}
					onChange={(content) =>
						handleFileChange(activeFile, content)
					}
				/>
			)}
			<RunButton onClick={handleRun} />
		</div>
	);
}
