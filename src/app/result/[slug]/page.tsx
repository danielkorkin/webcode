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
		if (!htmlFile) return "No HTML file found.";

		const parser = new DOMParser();
		const doc = parser.parseFromString(htmlFile.content, "text/html");

		// Find all linked stylesheets
		const linkedStylesheets: string[] = [];
		doc.querySelectorAll('link[rel="stylesheet"]').forEach(
			(linkElement) => {
				const href = linkElement.getAttribute("href");
				if (href) {
					linkedStylesheets.push(href);
				}
			}
		);

		const cssContent = files
			.filter(
				(file) =>
					file.type === "css" && linkedStylesheets.includes(file.name)
			)
			.map((file) => file.content)
			.join("\n");

		const jsFiles = files.filter((file) => file.type === "javascript");

		return (
			<>
				<style>{cssContent}</style>
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
