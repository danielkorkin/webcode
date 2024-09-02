"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ExistingProjects() {
	const [projectId, setProjectId] = useState("");
	const [error, setError] = useState("");
	const router = useRouter();

	const handleSearch = async () => {
		if (projectId) {
			try {
				const res = await fetch(`/api/project/${projectId}`);
				if (res.ok) {
					router.push(`/${projectId}/editor`);
				} else {
					setError(
						"Project ID not found. Please check and try again.",
					);
				}
			} catch (err) {
				setError("An error occurred while searching for the project.");
			}
		} else {
			setError("Please enter a valid Project ID.");
		}
	};

	return (
		<div className="flex h-screen items-center justify-center bg-gradient-to-br from-green-400 to-blue-600">
			<div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
				<h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
					Open an Existing Project
				</h2>
				<p className="text-gray-600 mb-6 text-center">
					To access your project, please enter the unique Project ID
					(UUID) found in the URL of your project.
				</p>
				<input
					type="text"
					value={projectId}
					onChange={(e) => setProjectId(e.target.value)}
					placeholder="Enter Project ID"
					className="w-full p-3 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
				<button
					onClick={handleSearch}
					className="w-full py-3 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transition"
				>
					Open Project
				</button>
				{error && (
					<p className="text-red-500 mt-4 text-center">{error}</p>
				)}
			</div>
		</div>
	);
}
