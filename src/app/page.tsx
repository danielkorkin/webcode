"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import dynamic from "next/dynamic";
import Sidebar from "@/components/Sidebar";
import FileList from "@/components/FileList";
import FileTabs from "@/components/FileTabs";
import SettingsPopup from "@/components/SettingsPopup";
import Marketplace from "@/components/Marketplace";
import CodeEditor from "@/components/CodeEditor";

const MonacoEditor = dynamic(() => import("monaco-editor"), { ssr: false });

export default function Home() {
	const [files, setFiles] = useState([]);
	const [openFiles, setOpenFiles] = useState([]);
	const [activeFile, setActiveFile] = useState<number | null>(null);
	const [isFileListOpen, setIsFileListOpen] = useState(false);
	const [isSettingsOpen, setIsSettingsOpen] = useState(false);
	const [isMarketplaceOpen, setIsMarketplaceOpen] = useState(false);
	const [extensions, setExtensions] = useState([]);
	const [theme, setTheme] = useState("vs-dark");
	const [tabSize, setTabSize] = useState(4); // Default tab size
	const [useTabs, setUseTabs] = useState(false); // Default to spaces
	const router = useRouter();

	useEffect(() => {
		let isMounted = true;
		const loadMonaco = async () => {
			if (typeof window !== "undefined" && isMounted) {
				const storedTheme = localStorage.getItem("theme") || "vs-dark";
				setTheme(storedTheme);
				const monaco = await import("monaco-editor");
				if (monaco && monaco.editor) {
					monaco.editor.setTheme(storedTheme as "vs" | "vs-dark");
				}
			}
		};
		loadMonaco();
		return () => {
			isMounted = false;
		};
	}, []);

	useEffect(() => {
		const updateTheme = async () => {
			if (typeof window !== "undefined") {
				localStorage.setItem("theme", theme);
				const monaco = await import("monaco-editor");
				if (monaco && monaco.editor) {
					monaco.editor.setTheme(theme as "vs" | "vs-dark");
				}
			}
		};
		updateTheme();
	}, [theme]);

	const handleAddFile = (name: string, type: string) => {
		const newFile = { name, content: "", type };
		setFiles([...files, newFile]);
		handleOpenFile(files.length);
	};

	const handleRenameFile = (index: number, newName: string) => {
		const updatedFiles = [...files];
		updatedFiles[index].name = newName;
		setFiles(updatedFiles);
		const openIndex = openFiles.findIndex(
			(file) => file.name === updatedFiles[index].name,
		);
		if (openIndex !== -1) {
			const updatedOpenFiles = [...openFiles];
			updatedOpenFiles[openIndex].name = newName;
			setOpenFiles(updatedOpenFiles);
		}
	};

	const handleDownloadFile = (index: number) => {
		const file = files[index];
		if (file) {
			const dataStr =
				"data:text/plain;charset=utf-8," +
				encodeURIComponent(file.content);
			const downloadAnchorNode = document.createElement("a");
			downloadAnchorNode.setAttribute("href", dataStr);
			downloadAnchorNode.setAttribute("download", file.name);
			document.body.appendChild(downloadAnchorNode);
			downloadAnchorNode.click();
			downloadAnchorNode.remove();
		}
	};

	const handleFileChange = (index: number, content: string) => {
		const updatedFiles = [...files];
		updatedFiles[index].content = content;
		setFiles(updatedFiles);
		const openIndex = openFiles.findIndex(
			(file) => file.name === updatedFiles[index].name,
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
			(file) => file.name === fileToOpen.name,
		);

		if (alreadyOpen === -1) {
			setOpenFiles([...openFiles, fileToOpen]);
			setActiveFile(openFiles.length);
		} else {
			setActiveFile(alreadyOpen);
		}
	};

	const handleCloseFile = (index: number) => {
		const updatedOpenFiles = openFiles.filter((_, i) => i !== index);
		setOpenFiles(updatedOpenFiles);
		setActiveFile(updatedOpenFiles.length > 0 ? 0 : null);
	};

	const handleCloseOthers = (index: number) => {
		const updatedOpenFiles = [openFiles[index]];
		setOpenFiles(updatedOpenFiles);
		setActiveFile(0);
	};

	const handleCloseRight = (index: number) => {
		const updatedOpenFiles = openFiles.slice(0, index + 1);
		setOpenFiles(updatedOpenFiles);
		setActiveFile(index);
	};

	const handleToggleFiles = () => {
		setIsFileListOpen(!isFileListOpen);
	};

	const handleRun = () => {
		if (typeof window !== "undefined") {
			const slug = uuidv4();
			localStorage.setItem(slug, JSON.stringify(files));
			router.push(`/result/${slug}`);
		}
	};

	const handleImport = (importedFiles: any[]) => {
		setFiles(importedFiles);
		setActiveFile(importedFiles.length > 0 ? 0 : null);
	};

	const handleExport = () => {
		if (typeof window !== "undefined") {
			const dataStr =
				"data:text/json;charset=utf-8," +
				encodeURIComponent(JSON.stringify(files, null, 2));
			const downloadAnchorNode = document.createElement("a");
			downloadAnchorNode.setAttribute("href", dataStr);
			downloadAnchorNode.setAttribute("download", "project-files.json");
			document.body.appendChild(downloadAnchorNode);
			downloadAnchorNode.click();
			downloadAnchorNode.remove();
		}
	};

	const handleThemeChange = (newTheme: string) => {
		setTheme(newTheme);
	};

	const handleInstallExtension = (extension: any) => {
		const isAlreadyInstalled = extensions.some(
			(ext) => ext.value === extension.value,
		);
		if (!isAlreadyInstalled) {
			setExtensions([...extensions, extension]);
		}
	};

	const handleToggleExtension = (value: string) => {
		setExtensions(
			extensions.map((ext) =>
				ext.value === value ? { ...ext, enabled: !ext.enabled } : ext,
			),
		);
	};

	const handleToggleMarketplace = () => {
		setIsMarketplaceOpen(!isMarketplaceOpen);
	};

	const handleExecuteFile = async (extensionValue: string, file: string) => {
		try {
			const extModule = await import(
				`@/extensions/${extensionValue}/${file}`
			);
			if (extModule && extModule.default) {
				extModule.default({
					files,
					setFiles,
					activeFile,
					setActiveFile,
					tabSize,
					useTabs,
				});
			}
		} catch (error) {
			console.error(
				`Failed to load file ${file} from extension ${extensionValue}:`,
				error,
			);
		}
	};

	const handleImportSettings = () => {
		const input = document.createElement("input");
		input.type = "file";
		input.accept = ".json";
		input.onchange = async (event: any) => {
			const file = event.target.files[0];
			const text = await file.text();
			const settings = JSON.parse(text);
			if (settings.theme) setTheme(settings.theme);
			if (settings.extensions) setExtensions(settings.extensions);
			if (settings.tabSize) setTabSize(settings.tabSize);
			if (settings.useTabs !== undefined) setUseTabs(settings.useTabs);
		};
		input.click();
	};

	const handleExportSettings = () => {
		const settings = {
			theme,
			extensions,
			tabSize,
			useTabs,
		};
		const dataStr =
			"data:text/json;charset=utf-8," +
			encodeURIComponent(JSON.stringify(settings, null, 2));
		const downloadAnchorNode = document.createElement("a");
		downloadAnchorNode.setAttribute("href", dataStr);
		downloadAnchorNode.setAttribute("download", "settings.json");
		document.body.appendChild(downloadAnchorNode);
		downloadAnchorNode.click();
		downloadAnchorNode.remove();
	};

	useEffect(() => {
		const loadEnabledExtensions = async () => {
			for (const extension of extensions) {
				if (extension.enabled) {
					for (const file of extension.files) {
						try {
							const extModule = await import(
								`@/extensions/${extension.value}/${file}`
							);
							if (extModule && extModule.default) {
								extModule.default({
									files,
									setFiles,
									activeFile,
									setActiveFile,
									tabSize,
									useTabs,
								});
							}
						} catch (error) {
							console.error(
								`Failed to load file ${file} from extension ${extension.value}:`,
								error,
							);
						}
					}
				}
			}
		};
		loadEnabledExtensions();
	}, [extensions]);

	return (
		<div
			className={`flex h-screen ${
				theme === "vs-dark"
					? "bg-code-gray text-white"
					: "bg-white text-black"
			}`}
		>
			<div className="flex">
				<Sidebar
					onToggleFiles={handleToggleFiles}
					onAddFile={handleAddFile}
					onImport={handleImport}
					onExport={handleExport}
					onRun={handleRun}
					onOpenSettings={() => setIsSettingsOpen(true)}
					onOpenMarketplace={handleToggleMarketplace}
					onImportSettings={handleImportSettings}
					onExportSettings={handleExportSettings}
					theme={theme}
				/>
				{isFileListOpen && (
					<FileList
						files={files}
						onOpenFile={handleOpenFile}
						onRenameFile={handleRenameFile}
						onDownloadFile={handleDownloadFile}
						theme={theme}
					/>
				)}
				{isMarketplaceOpen && (
					<Marketplace
						onInstallExtension={handleInstallExtension}
						installedExtensions={extensions}
						theme={theme}
					/>
				)}
			</div>
			<div
				className={`flex-1 flex flex-col p-4 transition-all duration-300 ${
					isFileListOpen ? "ml-[68px]" : "ml-[16px]"
				}`}
			>
				<FileTabs
					openFiles={openFiles}
					activeFile={activeFile}
					onSelectFile={setActiveFile}
					onCloseFile={handleCloseFile}
					onDownloadFile={handleDownloadFile}
					onCloseOthers={handleCloseOthers}
					onCloseRight={handleCloseRight}
					theme={theme}
				/>
				<div
					className="flex-1 overflow-auto"
					style={{ paddingBottom: "10px" }}
				>
					{activeFile !== null && openFiles[activeFile] && (
						<CodeEditor
							language={openFiles[activeFile].type}
							content={openFiles[activeFile].content}
							theme={theme}
							tabSize={tabSize}
							useTabs={useTabs}
							onChange={(content) =>
								handleFileChange(
									files.findIndex(
										(f) =>
											f.name ===
											openFiles[activeFile].name,
									),
									content,
								)
							}
						/>
					)}
				</div>
			</div>
			<SettingsPopup
				isOpen={isSettingsOpen}
				onClose={() => setIsSettingsOpen(false)}
				onThemeChange={handleThemeChange}
				currentTheme={theme}
				extensions={extensions}
				onToggleExtension={handleToggleExtension}
				onExecuteFile={handleExecuteFile}
				openFiles={openFiles}
				tabSize={tabSize}
				useTabs={useTabs}
				onTabSizeChange={setTabSize}
				onUseTabsChange={setUseTabs}
			/>
		</div>
	);
}
