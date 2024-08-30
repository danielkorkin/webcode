"use client";

import Editor from "@/components/Editor";
import RunButton from "@/components/RunButton";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

export default function Home() {
	const [code, setCode] = useState({ html: "", css: "", js: "" });
	const { handleSubmit } = useForm();
	const router = useRouter();

	const handleRun = () => {
		const slug = uuidv4();
		const fileName = `/result/${slug}`;
		localStorage.setItem(slug, JSON.stringify(code));
		router.push(fileName);
	};

	return (
		<div className="container mx-auto p-4">
			<h1 className="text-3xl font-bold mb-4">Web VS Code</h1>
			<form onSubmit={handleSubmit(handleRun)}>
				<div className="grid grid-cols-3 gap-4">
					<Editor
						language="html"
						label="HTML"
						onChange={(value) => setCode({ ...code, html: value })}
					/>
					<Editor
						language="css"
						label="CSS"
						onChange={(value) => setCode({ ...code, css: value })}
					/>
					<Editor
						language="javascript"
						label="JavaScript"
						onChange={(value) => setCode({ ...code, js: value })}
					/>
				</div>
				<RunButton />
			</form>
		</div>
	);
}
