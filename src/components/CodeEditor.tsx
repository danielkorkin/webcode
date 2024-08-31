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
		<div
			ref={editorContainerRef}
			className="flex-1 pb-2" // Using Tailwind CSS for padding and flex properties
		>
			<Editor
				height="100%"
				language={language}
				value={
					typeof content === "object"
						? JSON.stringify(content, null, "\t")
						: content
				}
				theme={theme}
				onChange={handleEditorChange}
				options={{
					scrollBeyondLastLine: false, // Optional: Disable scrolling past the end
				}}
			/>
		</div>
	);
}
