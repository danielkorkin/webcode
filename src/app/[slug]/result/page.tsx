"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function ResultPage() {
	const { slug } = useParams();
	const [htmlContent, setHtmlContent] = useState("");

	useEffect(() => {
		const fetchData = async () => {
			const res = await fetch(`/api/project/${slug}`);
			const data = await res.json();

			// Ensure data and data.project.code are valid
			if (!data || !data.project || !Array.isArray(data.project.code)) {
				console.error("Invalid project data structure:", data);
				setHtmlContent("<p>Failed to load project content.</p>");
				return;
			}

			const code = data.project.code;

			// Find the HTML file
			const htmlFile = code.find((file) => file.type === "html");
			let htmlContent = htmlFile
				? htmlFile.content
				: "<p>No HTML content found.</p>";

			// Find and inject CSS files into the HTML content
			const cssFiles = code.filter((file) => file.type === "css");
			cssFiles.forEach((cssFile) => {
				const cssLinkTag = `<link rel="stylesheet" href="${cssFile.name}">`;
				if (htmlContent.includes(cssLinkTag)) {
					const cssStyleTag = `<style>${cssFile.content}</style>`;
					htmlContent = htmlContent.replace(cssLinkTag, cssStyleTag);
				}
			});

			// Find and inject JS files into the HTML content
			const jsFiles = code.filter((file) => file.type === "javascript");
			jsFiles.forEach((jsFile) => {
				const jsScriptTag = `<script src="${jsFile.name}"></script>`;
				if (htmlContent.includes(jsScriptTag)) {
					const jsInlineScript = `<script>${jsFile.content}</script>`;
					htmlContent = htmlContent.replace(
						jsScriptTag,
						jsInlineScript,
					);
				}
			});

			setHtmlContent(htmlContent);
		};

		fetchData();
	}, [slug]);

	return (
		<div className="h-screen bg-white">
			<iframe
				srcDoc={htmlContent}
				className="w-full h-full border-none"
				title="Project Preview"
			></iframe>
		</div>
	);
}
