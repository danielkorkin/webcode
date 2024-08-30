"use client";

import dynamic from "next/dynamic";

const Editor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

interface EditorProps {
	language: "html" | "css" | "javascript";
	label: string;
	onChange: (value: string) => void;
}

export default function CodeEditor({ language, label, onChange }: EditorProps) {
	const handleEditorChange = (value: string | undefined) => {
		if (value) {
			onChange(value);
		}
	};

	return (
		<div>
			<label className="block text-lg font-bold mb-2">{label}</label>
			<Editor
				height="300px"
				language={language}
				theme="vs-dark"
				onChange={handleEditorChange}
			/>
		</div>
	);
}
