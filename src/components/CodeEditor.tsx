"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";

const Editor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

interface EditorProps {
	language: "html" | "css" | "javascript";
	content: string;
	theme: string;
	onChange: (value: string) => void;
}

export default function CodeEditor({
	language,
	content,
	theme,
	onChange,
}: EditorProps) {
	const editorContainerRef = useRef<HTMLDivElement>(null);

	const handleEditorChange = (value: string | undefined) => {
		if (value) {
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
		<div
			ref={editorContainerRef}
			className="flex-1"
			style={{ paddingBottom: "10px" }}
		>
			<Editor
				height="100%"
				language={language}
				value={content}
				theme={theme}
				onChange={handleEditorChange}
				options={{
					scrollBeyondLastLine: false, // Optional: Disable scrolling past the end
				}}
			/>
		</div>
	);
}
