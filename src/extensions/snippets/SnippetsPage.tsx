import { useState } from "react";
import { FaSearch } from "react-icons/fa";

interface Snippet {
	name: string;
	content: string;
	type: "html" | "css" | "javascript";
}

interface Template {
	name: string;
	files: Snippet[];
}

interface SnippetsPageProps {
	snippets: Snippet[];
	templates: Template[];
	onAddSnippet: (snippet: Snippet, fileName: string) => void;
	onAddTemplate: (template: Template) => void;
	theme: string;
}

export default function SnippetsPage({
	snippets,
	templates,
	onAddSnippet,
	onAddTemplate,
	theme,
}: SnippetsPageProps) {
	const [searchTerm, setSearchTerm] = useState("");
	const [filterType, setFilterType] = useState<"snippets" | "templates">(
		"snippets",
	);
	const [checkedTypes, setCheckedTypes] = useState({
		html: true,
		css: true,
		javascript: true,
	});

	const filteredSnippets = snippets.filter(
		(snippet) =>
			snippet.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
			checkedTypes[snippet.type],
	);

	const filteredTemplates = templates.filter((template) =>
		template.name.toLowerCase().includes(searchTerm.toLowerCase()),
	);

	const handleTypeChange = (type: "html" | "css" | "javascript") => {
		setCheckedTypes({ ...checkedTypes, [type]: !checkedTypes[type] });
	};

	return (
		<div
			className={`p-4 ${theme === "vs-dark" ? "bg-gray-900 text-white" : "bg-white text-black"}`}
		>
			<div className="flex mb-4">
				<input
					type="text"
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					placeholder="Search..."
					className="p-2 border rounded-md flex-1"
				/>
				<FaSearch className="ml-2" />
			</div>

			<div className="flex mb-4">
				<select
					value={filterType}
					onChange={(e) =>
						setFilterType(
							e.target.value as "snippets" | "templates",
						)
					}
					className="p-2 border rounded-md"
				>
					<option value="snippets">Snippets</option>
					<option value="templates">Templates</option>
				</select>
			</div>

			{filterType === "snippets" && (
				<div>
					<h3 className="text-lg mb-2">Snippets</h3>
					<div className="flex space-x-2 mb-4">
						<label>
							<input
								type="checkbox"
								checked={checkedTypes.html}
								onChange={() => handleTypeChange("html")}
							/>
							HTML
						</label>
						<label>
							<input
								type="checkbox"
								checked={checkedTypes.css}
								onChange={() => handleTypeChange("css")}
							/>
							CSS
						</label>
						<label>
							<input
								type="checkbox"
								checked={checkedTypes.javascript}
								onChange={() => handleTypeChange("javascript")}
							/>
							JavaScript
						</label>
					</div>
					<ul>
						{filteredSnippets.map((snippet, idx) => (
							<li key={idx} className="mb-2">
								<button
									className="text-blue-500 underline"
									onClick={() => {
										const fileName = prompt(
											`Enter the file name to insert the ${snippet.type} snippet into:`,
										);
										if (fileName)
											onAddSnippet(snippet, fileName);
									}}
								>
									{snippet.name}
								</button>
							</li>
						))}
					</ul>
				</div>
			)}

			{filterType === "templates" && (
				<div>
					<h3 className="text-lg mb-2">Templates</h3>
					<ul>
						{filteredTemplates.map((template, idx) => (
							<li key={idx} className="mb-2">
								<button
									className="text-blue-500 underline"
									onClick={() => {
										const confirmed = confirm(
											`Are you sure you want to apply the template "${template.name}"? This will overwrite existing files.`,
										);
										if (confirmed) onAddTemplate(template);
									}}
								>
									{template.name}
								</button>
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
}
