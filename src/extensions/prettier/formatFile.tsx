import * as prettier from "prettier/standalone";
import * as parserBabel from "prettier/parser-babel";
import * as parserHtml from "prettier/parser-html";
import * as parserCss from "prettier/parser-postcss";

interface File {
	name: string;
	content: string | object;
	type: "html" | "css" | "javascript";
}

interface FormatFileProps {
	files: File[];
	setFiles: (files: File[]) => void;
	activeFile: number | null;
	tabSize: number;
	useTabs: boolean;
}

export default async function formatFile({
	files,
	setFiles,
	activeFile,
	tabSize,
	useTabs,
}: FormatFileProps) {
	if (activeFile === null) return;

	const file = files[activeFile];
	if (!file) return;

	let formattedContent: string = file.content as string;

	console.log(
		`Processing file: ${file.name}, Content type: ${typeof file.content}`,
	);

	// Ensure content is always treated as a string
	if (typeof file.content !== "string") {
		formattedContent = JSON.stringify(file.content, null, "\t");
	}

	try {
		// Await the formatting operation to ensure it completes
		formattedContent = await prettier.format(formattedContent, {
			parser: file.type === "javascript" ? "babel" : file.type,
			plugins: [parserBabel, parserHtml, parserCss],
			tabWidth: tabSize,
			useTabs: useTabs,
		});
	} catch (e) {
		console.error(`Prettier formatting error in file ${file.name}:`, e);
	}

	// Log the formatted output and its type
	console.log(`Formatted output for ${file.name}:`, formattedContent);
	console.log(`Type of formatted content: ${typeof formattedContent}`);

	const updatedFiles = [...files];
	updatedFiles[activeFile] = {
		...file,
		content: formattedContent, // Update the content
	};

	// Update the files with the new formatted content
	console.log(
		"Updating file content with formatted content:",
		updatedFiles[activeFile],
	);
	setFiles(updatedFiles);
}
