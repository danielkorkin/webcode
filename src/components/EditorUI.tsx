import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Sidebar from "@/components/Sidebar";
import FileList from "@/components/FileList";
import FileTabs from "@/components/FileTabs";
import SettingsPopup from "@/components/SettingsPopup";
import Marketplace from "@/components/Marketplace";
import CodeEditor from "@/components/CodeEditor";

const MonacoEditor = dynamic(() => import("monaco-editor"), { ssr: false });

export default function EditorUI({ projectData }) {
	const [files, setFiles] = useState(projectData?.code || []); // Use projectData.code
	const [openFiles, setOpenFiles] = useState([]);
	const [activeFile, setActiveFile] = useState<number | null>(null);
	const [isFileListOpen, setIsFileListOpen] = useState(false);
	const [isSettingsOpen, setIsSettingsOpen] = useState(false);
	const [isMarketplaceOpen, setIsMarketplaceOpen] = useState(false);
	const [extensions, setExtensions] = useState(
		projectData?.settings?.extensions || [],
	);
	const [theme, setTheme] = useState(
		projectData?.settings?.theme || "vs-dark",
	);
	const [tabSize, setTabSize] = useState(projectData?.settings?.tabSize || 4);
	const [useTabs, setUseTabs] = useState(
		projectData?.settings?.useTabs || false,
	);
	const [editorVisibility, setEditorVisibility] = useState(
		projectData?.settings?.editorVisibility || "private",
	);
	const [projectPassword, setProjectPassword] = useState(
		projectData?.settings?.projectPassword || "",
	);
	const [unsavedSettings, setUnsavedSettings] = useState({
		theme,
		extensions,
		tabSize,
		useTabs,
		editorVisibility,
		projectPassword,
	});

	const router = useRouter();

	// Function to save project data
	const saveProjectData = useCallback(async () => {
		try {
			console.log("Sending data:", {
				code: files,
				settings: unsavedSettings,
			});

			const res = await fetch(`/api/project/${projectData.id}/update`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					code: files,
					settings: unsavedSettings,
				}),
			});

			if (!res.ok) {
				throw new Error(
					`Failed to save project data. Status: ${res.status}`,
				);
			}

			const result = await res.json();
			console.log("Save successful:", result);
		} catch (error) {
			console.error("Error saving project data:", error);
		}
	}, [files, unsavedSettings, projectData.id]);

	// Autosave every 5 seconds
	useEffect(() => {
		const interval = setInterval(saveProjectData, 5000);
		return () => clearInterval(interval);
	}, [saveProjectData]);

	const handleSaveSettings = () => {
		// Save the updated settings
		setUnsavedSettings({
			theme,
			extensions,
			tabSize,
			useTabs,
			editorVisibility,
			projectPassword,
		});
		saveProjectData();
		setIsSettingsOpen(false);
	};

	const handleDiscardSettings = () => {
		// Revert unsavedSettings to the original projectData settings
		setUnsavedSettings({
			theme: projectData.settings.theme,
			extensions: projectData.settings.extensions,
			tabSize: projectData.settings.tabSize,
			useTabs: projectData.settings.useTabs,
			editorVisibility: projectData.settings.editorVisibility,
			projectPassword: projectData.settings.projectPassword,
		});
		setIsSettingsOpen(false);
	};

	// Handler functions
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

	const handleDeleteFile = (index: number) => {
		const updatedFiles = files.filter((_, i) => i !== index);
		setFiles(updatedFiles);
		setOpenFiles(openFiles.filter((_, i) => i !== index));
		setActiveFile(updatedFiles.length > 0 ? 0 : null);
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

	const handleReorderFiles = (newOrder: any[]) => {
		setOpenFiles(newOrder);
	};

	const handleImport = (importedFiles: any[]) => {
		setFiles(importedFiles);
		setActiveFile(importedFiles.length > 0 ? 0 : null);
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

	const handleThemeChange = (newTheme: string) => {
		setTheme(newTheme);
		setUnsavedSettings({ ...unsavedSettings, theme: newTheme });
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
		setUnsavedSettings({
			...unsavedSettings,
			extensions: extensions.map((ext) =>
				ext.value === value ? { ...ext, enabled: !ext.enabled } : ext,
			),
		});
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
			if (settings.theme)
				setUnsavedSettings({
					...unsavedSettings,
					theme: settings.theme,
				});
			if (settings.extensions)
				setUnsavedSettings({
					...unsavedSettings,
					extensions: settings.extensions,
				});
			if (settings.tabSize)
				setUnsavedSettings({
					...unsavedSettings,
					tabSize: settings.tabSize,
				});
			if (settings.useTabs !== undefined)
				setUnsavedSettings({
					...unsavedSettings,
					useTabs: settings.useTabs,
				});
			if (settings.editorVisibility)
				setUnsavedSettings({
					...unsavedSettings,
					editorVisibility: settings.editorVisibility,
				});
			if (settings.projectPassword)
				setUnsavedSettings({
					...unsavedSettings,
					projectPassword: settings.projectPassword,
				});
		};
		input.click();
	};

	const handleExportSettings = () => {
		const settings = unsavedSettings;
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

	const convertTabsToSpaces = () => {
		const updatedFiles = files.map((file) => {
			const newContent = file.content.replace(/\t/g, " ".repeat(tabSize));
			return { ...file, content: newContent };
		});
		setFiles(updatedFiles);
		setOpenFiles(updatedFiles);
	};

	const convertSpacesToTabs = () => {
		const updatedFiles = files.map((file) => {
			const spaceRegex = new RegExp(` {${tabSize}}`, "g");
			const newContent = file.content.replace(spaceRegex, "\t");
			return { ...file, content: newContent };
		});
		setFiles(updatedFiles);
		setOpenFiles(updatedFiles);
	};

	const handleEditorVisibilityChange = (visibility: string) => {
		setEditorVisibility(visibility);
		setUnsavedSettings({
			...unsavedSettings,
			editorVisibility: visibility,
		});
	};

	const handleProjectPasswordChange = (password: string) => {
		setProjectPassword(password);
		setUnsavedSettings({ ...unsavedSettings, projectPassword: password });
	};

	const handleResetPassword = () => {
		setProjectPassword("");
		setUnsavedSettings({ ...unsavedSettings, projectPassword: "" });
	};

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
					onToggleFiles={() => setIsFileListOpen(!isFileListOpen)}
					onAddFile={handleAddFile}
					onImport={handleImport}
					onExport={handleExport}
					onRun={() => router.push(`/result/${projectData.id}`)}
					onOpenSettings={() => setIsSettingsOpen(true)}
					onOpenMarketplace={handleToggleMarketplace}
					onImportSettings={handleImportSettings}
					onExportSettings={handleExportSettings}
					onSave={saveProjectData}
					theme={theme}
				/>
				{isFileListOpen && (
					<FileList
						files={files}
						onOpenFile={handleOpenFile}
						onRenameFile={handleRenameFile}
						onDownloadFile={handleDownloadFile}
						onDeleteFile={handleDeleteFile}
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
					onDeleteFile={handleDeleteFile}
					onCloseOthers={handleCloseOthers}
					onCloseRight={handleCloseRight}
					onReorderFiles={handleReorderFiles}
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
				currentTheme={unsavedSettings.theme}
				extensions={unsavedSettings.extensions}
				onToggleExtension={handleToggleExtension}
				onExecuteFile={handleExecuteFile}
				openFiles={openFiles}
				tabSize={unsavedSettings.tabSize}
				useTabs={unsavedSettings.useTabs}
				onTabSizeChange={(size) =>
					setUnsavedSettings({ ...unsavedSettings, tabSize: size })
				}
				onUseTabsChange={(useTabs) =>
					setUnsavedSettings({ ...unsavedSettings, useTabs })
				}
				onConvertTabsToSpaces={convertTabsToSpaces}
				onConvertSpacesToTabs={convertSpacesToTabs}
				editorVisibility={unsavedSettings.editorVisibility}
				onEditorVisibilityChange={handleEditorVisibilityChange}
				projectPassword={unsavedSettings.projectPassword}
				onProjectPasswordChange={handleProjectPasswordChange}
				onResetPassword={handleResetPassword}
				onSaveSettings={handleSaveSettings}
				onDiscardSettings={handleDiscardSettings}
			/>
		</div>
	);
}
