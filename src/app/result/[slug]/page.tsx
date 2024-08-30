"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function ResultPage() {
	const { slug } = useParams();
	const [files, setFiles] = useState<
		{ name: string; content: string; type: "html" | "css" | "javascript" }[]
	>([]);

	useEffect(() => {
		const savedFiles = localStorage.getItem(slug!);
		if (savedFiles) {
			setFiles(JSON.parse(savedFiles));
		}
	}, [slug]);

	const renderHTML = () => {
		const htmlFile = files.find((file) => file.type === "html");
		const cssFiles = files.filter((file) => file.type === "css");
		const jsFiles = files.filter((file) => file.type === "javascript");

		if (!htmlFile) return "No HTML file found.";

		return (
			<>
				{cssFiles.map((file) => (
					<style
						key={file.name}
						dangerouslySetInnerHTML={{ __html: file.content }}
					/>
				))}
				<div dangerouslySetInnerHTML={{ __html: htmlFile.content }} />
				{jsFiles.map((file) => (
					<script
						key={file.name}
						dangerouslySetInnerHTML={{ __html: file.content }}
					/>
				))}
			</>
		);
	};

	return <div className="result">{renderHTML()}</div>;
}
