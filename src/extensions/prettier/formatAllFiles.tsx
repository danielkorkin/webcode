import * as prettier from "prettier/standalone";
import * as parserBabel from "prettier/parser-babel";
import * as parserHtml from "prettier/parser-html";
import * as parserCss from "prettier/parser-postcss";

export default function formatAllFiles({ files, setFiles }) {
	const updatedFiles = files.map(async (file) => {
		let formattedContent = file.content; // Initialize with original content

		console.log(
			`Processing file: ${file.name}, Content type: ${typeof file.content}`,
		);

		// Log content before stringifying
		console.log(
			`Content before stringifying for file ${file.name}:`,
			file.content,
		);

		// Ensure the file content is a string
		if (typeof file.content !== "string") {
			console.warn(
				`Converting content of file ${file.name} to a string.`,
			);
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

		return {
			...file,
			content: formattedContent,
		};
	});

	// Wait for all files to be formatted before setting state
	Promise.all(updatedFiles).then(setFiles);

	console.log("Updated files (after setFiles):", updatedFiles);
	console.log("State files:", files); // Check if state reflects the update
}
