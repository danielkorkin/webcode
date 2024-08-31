"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import Sidebar from "@/components/Sidebar";
import FileList from "@/components/FileList";
import FileTabs from "@/components/FileTabs";
import CodeEditor from "@/components/CodeEditor";

export default function Home() {
	const [files, setFiles] = useState<
		{ name: string; content: string; type: "html" | "css" | "javascript" }[]
	>([]);
	const [openFiles, setOpenFiles] = useState<
		{ name: string; content: string; type: "html" | "css" | "javascript" }[]
	>([]);
	const [activeFile, setActiveFile] = useState<number | null>(null);
	const [isFileListOpen, setIsFileListOpen] = useState(false); // Closed by default
	const router = useRouter();

	const handleAddFile = (
		name: string,
		type: "html" | "css" | "javascript"
	) => {
		const newFile = { name, content: "", type };
		const updatedFiles = [...files, newFile];
		setFiles(updatedFiles);

		const fileIndex = updatedFiles.length - 1;
		handleOpenFile(fileIndex);
	};

	const handleFileChange = (index: number, content: string) => {
		const updatedFiles = [...files];
		updatedFiles[index].content = content;
		setFiles(updatedFiles);

		const openIndex = openFiles.findIndex(
			(file) => file.name === updatedFiles[index].name
		);
		if (openIndex !== -1) {
			const updatedOpenFiles = [...openFiles];
			updatedOpenFiles[openIndex].content = content;
			setOpenFiles(updatedOpenFiles);
		}
	};

	const handleOpenFile = (index: number) => {
		const fileToOpen = files[index];
		if (!fileToOpen) return;

		const alreadyOpen = openFiles.findIndex(
			(file) => file.name === fileToOpen.name
		);

		if (alreadyOpen === -1) {
			setOpenFiles([...openFiles, fileToOpen]);
			setActiveFile(openFiles.length); // Set the new file as active
		} else {
			setActiveFile(alreadyOpen);
		}
	};

	const handleCloseFile = (index: number) => {
		const updatedOpenFiles = openFiles.filter((_, i) => i !== index);
		setOpenFiles(updatedOpenFiles);
		setActiveFile(updatedOpenFiles.length > 0 ? 0 : null); // Set the first file as active if available
	};

	const handleToggleFiles = () => {
		setIsFileListOpen(!isFileListOpen);
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
		<div className="flex">
			<Sidebar
				onToggleFiles={handleToggleFiles}
				onAddFile={handleAddFile}
				onImport={handleImport}
				onExport={handleExport}
				onRun={handleRun}
			/>
			<div
				className={`flex-1 p-4 transition-all duration-300 ${
					isFileListOpen ? "ml-64" : "ml-0"
				}`}
			>
				<FileTabs
					openFiles={openFiles}
					activeFile={activeFile}
					onSelectFile={setActiveFile}
					onCloseFile={handleCloseFile}
				/>
				{activeFile !== null && openFiles[activeFile] && (
					<CodeEditor
						language={openFiles[activeFile].type}
						content={openFiles[activeFile].content}
						onChange={(content) =>
							handleFileChange(
								files.findIndex(
									(f) => f.name === openFiles[activeFile].name
								),
								content
							)
						}
					/>
				)}
			</div>
			{isFileListOpen && (
				<div className="fixed left-16 top-0 h-full w-64 bg-gray-900 text-white p-4 shadow-lg z-10">
					<FileList files={files} onOpenFile={handleOpenFile} />
				</div>
			)}
		</div>
	);
}
