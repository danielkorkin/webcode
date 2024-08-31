import * as prettier from "prettier/standalone";
import * as parserBabel from "prettier/parser-babel";
import * as parserHtml from "prettier/parser-html";
import * as parserCss from "prettier/parser-postcss";

export default async function formatFile({ files, setFiles, activeFile }) {
	if (activeFile === null) return;

	const file = files[activeFile];
	if (!file) return;

	let formattedContent = file.content; // Initialize with original content

	console.log(
		`Processing file: ${file.name}, Content type: ${typeof file.content}`,
	);

	// Log content before stringifying
	console.log(
		`Content before stringifying for file ${file.name}:`,
		file.content,
	);

	// Convert content to a string if it's an object or any other type
	if (typeof file.content !== "string") {
		console.warn(`Converting content of file ${file.name} to a string.`);
		file.content = JSON.stringify(file.content, null, "\t");
	}

	// Log content after stringifying
	console.log(
		`Content after stringifying for file ${file.name}:`,
		file.content,
	);

	try {
		switch (file.type) {
			case "javascript":
				formattedContent = await prettier.format(file.content, {
					parser: "babel",
					plugins: [parserBabel],
				});
				break;
			case "html":
				formattedContent = await prettier.format(file.content, {
					parser: "html",
					plugins: [parserHtml],
				});
				break;
			case "css":
				formattedContent = await prettier.format(file.content, {
					parser: "css",
					plugins: [parserCss],
				});
				break;
			default:
				console.warn(
					`Unsupported file type ${file.type} for file ${file.name}`,
				);
				break;
		}
		console.log(
			`Formatted content for file ${file.name}:`,
			formattedContent,
		);
	} catch (e) {
		console.error(`Prettier formatting error in file ${file.name}:`, e);
	}

	const updatedFiles = [...files];
	updatedFiles[activeFile] = {
		...file,
		content: formattedContent,
	};

	setFiles(updatedFiles);

	console.log("Updated files (after setFiles):", updatedFiles);
	console.log("State files:", files); // Check if state reflects the update
}
