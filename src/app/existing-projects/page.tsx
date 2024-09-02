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
		<div className="flex h-screen items-center justify-center">
			<div className="space-y-4">
				<input
					type="text"
					value={projectId}
					onChange={(e) => setProjectId(e.target.value)}
					placeholder="Enter Project ID"
					className="p-2 border border-gray-400 rounded-md"
				/>
				<button onClick={handleSearch} className="btn btn-primary">
					Open Project
				</button>
				{error && <p className="text-red-500">{error}</p>}
			</div>
		</div>
	);
}
