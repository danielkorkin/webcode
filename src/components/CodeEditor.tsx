"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";

const Editor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

interface EditorProps {
	language: "html" | "css" | "javascript";
	content: string;
	theme: string;
	tabSize: number;
	useTabs: boolean;
	onChange: (value: string) => void;
}

export default function CodeEditor({
	language,
	content,
	theme,
	tabSize,
	useTabs,
	onChange,
}: EditorProps) {
	const editorContainerRef = useRef<HTMLDivElement>(null);
	const editorRef = useRef<any>(null);

	const handleEditorChange = (value: string | undefined) => {
		if (value !== undefined && value !== content) {
			onChange(value);
		}
	};

	useEffect(() => {
		if (editorContainerRef.current) {
			editorContainerRef.current.style.height = `calc(100vh - 10px)`;
		}
	}, []);

	useEffect(() => {
		if (editorRef.current) {
			const model = editorRef.current.getModel();
			if (model && model.getValue() !== content) {
				model.setValue(content);
			}
		}
	}, [content]);

	return (
		<div ref={editorContainerRef} className="flex-1 pb-2">
			<Editor
				height="100%"
				language={language}
				theme={theme}
				value={content}
				onChange={handleEditorChange}
				options={{
					tabSize: tabSize,
					insertSpaces: !useTabs,
					scrollBeyondLastLine: false,
				}}
				onMount={(editor) => {
					editorRef.current = editor;
				}}
			/>
		</div>
	);
}
