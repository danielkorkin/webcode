import * as prettier from "prettier/standalone";
import * as parserBabel from "prettier/parser-babel";
import * as parserHtml from "prettier/parser-html";
import * as parserCss from "prettier/parser-postcss";

interface File {
	name: string;
	content: string | object;
	type: "html" | "css" | "javascript";
}

interface FormatAllFilesProps {
	files: File[];
	setFiles: (files: File[]) => void;
	tabSize: number;
	useTabs: boolean;
}

export default async function formatAllFiles({
	files,
	setFiles,
	tabSize,
	useTabs,
}: FormatAllFilesProps) {
	const updatedFiles = await Promise.all(
		files.map(async (file) => {
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
				console.error(
					`Prettier formatting error in file ${file.name}:`,
					e,
				);
			}

			// Log the formatted output and its type
			console.log(`Formatted output for ${file.name}:`, formattedContent);
			console.log(
				`Type of formatted content: ${typeof formattedContent}`,
			);

			return {
				...file,
				content: formattedContent, // Update the content
			};
		}),
	);

	// Ensure that the files are updated
	console.log("Updating files with formatted content:", updatedFiles);
	setFiles(updatedFiles); // This will update the state with the new content
}
