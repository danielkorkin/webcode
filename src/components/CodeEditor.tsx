"use client";

import dynamic from "next/dynamic";

const Editor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

interface EditorProps {
	language: "html" | "css" | "javascript";
	content: string;
	onChange: (value: string) => void;
}

export default function CodeEditor({
	language,
	content,
	onChange,
}: EditorProps) {
	const handleEditorChange = (value: string | undefined) => {
		if (value) {
			onChange(value);
		}
	};

	return (
		<div>
			<Editor
				height="400px"
				language={language}
				value={content}
				theme="vs-dark"
				onChange={handleEditorChange}
			/>
		</div>
	);
}
