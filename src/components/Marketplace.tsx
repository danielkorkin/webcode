// src/components/Marketplace.tsx
import { useState, useEffect } from "react";
import { FaDownload } from "react-icons/fa";

interface Extension {
	title: string;
	description: string;
	icon: string;
	files: string[];
	enabled: boolean;
	uiComponents: any[]; // Extend to include UI components and actions
}

export default function Marketplace({
	onInstallExtension,
	theme,
	installedExtensions,
}: {
	onInstallExtension: (extension: Extension) => void;
	theme: string;
	installedExtensions: Extension[];
}) {
	const [extensions, setExtensions] = useState<Extension[]>([]);

	useEffect(() => {
		// Fetch the list of extensions (could be local or from a server)
		const fetchExtensions = async () => {
			const response = await fetch("/extensions/extensions-list.json");
			const data = await response.json();
			setExtensions(data);
		};
		fetchExtensions();
	}, []);

	return (
		<div
			className={`w-64 h-screen p-4 shadow-lg ${
				theme === "vs-dark"
					? "bg-code-grack text-white"
					: "bg-code-gray-100 text-black"
			}`}
		>
			<h3 className="text-lg font-bold mb-4">Marketplace</h3>
			<ul>
				{extensions.map((extension) => {
					const isInstalled = installedExtensions.some(
						(ext) => ext.title === extension.title
					);
					return (
						<li
							key={extension.title}
							className={`mb-4 p-2 rounded-md ${
								theme === "vs-dark"
									? "bg-gray-700 text-white"
									: "bg-gray-200 text-black"
							}`}
						>
							<img
								src={extension.icon}
								alt={extension.title}
								className="h-8 w-8"
							/>
							<h4 className="font-bold">{extension.title}</h4>
							<p>{extension.description}</p>
							<div className="flex justify-between mt-2">
								{isInstalled ? (
									<span className="text-green-500">
										Installed
									</span>
								) : (
									<button
										className="bg-green-500 text-white p-2 rounded-md"
										onClick={() =>
											onInstallExtension(extension)
										}
									>
										<FaDownload /> Install
									</button>
								)}
							</div>
						</li>
					);
				})}
			</ul>
		</div>
	);
}