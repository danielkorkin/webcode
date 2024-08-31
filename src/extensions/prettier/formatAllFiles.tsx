import * as prettier from "prettier/standalone";
import * as parserBabel from "prettier/parser-babel";
import * as parserHtml from "prettier/parser-html";
import * as parserCss from "prettier/parser-postcss";

export default function formatAllFiles({ files, setFiles, tabSize, useTabs }) {
	const updatedFiles = files.map(async (file) => {
		let formattedContent = file.content;

		console.log(
			`Processing file: ${file.name}, Content type: ${typeof file.content}`,
		);

		if (typeof file.content !== "string") {
			file.content = JSON.stringify(file.content, null, "\t");
		}

		try {
			formattedContent = await prettier.format(file.content, {
				parser: file.type === "javascript" ? "babel" : file.type,
				plugins: [parserBabel, parserHtml, parserCss],
				tabWidth: tabSize,
				useTabs: useTabs,
			});
		} catch (e) {
			console.error(`Prettier formatting error in file ${file.name}:`, e);
		}

		return {
			...file,
			content: formattedContent,
		};
	});

	Promise.all(updatedFiles).then(setFiles);
}
