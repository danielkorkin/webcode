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

	const handleEditorChange = (value: string | undefined) => {
		if (value !== undefined) {
			onChange(value);
		}
	};

	useEffect(() => {
		if (editorContainerRef.current) {
			// Set the height of the editor container dynamically
			editorContainerRef.current.style.height = `calc(100vh - 10px)`;
		}
	}, []);

	return (
		<div ref={editorContainerRef} className="flex-1 pb-2">
			<Editor
				height="100%"
				language={language}
				value={content}
				theme={theme}
				onChange={handleEditorChange}
				options={{
					tabSize: tabSize,
					insertSpaces: !useTabs, // Correct setting for spaces vs tabs
					scrollBeyondLastLine: false,
				}}
			/>
		</div>
	);
}
