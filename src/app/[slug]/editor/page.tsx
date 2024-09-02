"use client"

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import EditorUI from "@/components/EditorUI"; // The main UI component

export default function EditorPage() {
	const { slug } = useParams();
	const [projectData, setProjectData] = useState(null);
	const [requiresPassword, setRequiresPassword] = useState(false);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [password, setPassword] = useState("");
	const router = useRouter();

	useEffect(() => {
		const fetchData = async () => {
			const res = await fetch(`/api/project/${slug}`);
			const data = await res.json();

			if (data.error) {
				alert("Project not found.");
				router.push("/");
				return;
			}

			setProjectData(data.project);
			setRequiresPassword(data.requiresPassword);

			if (
				!data.requiresPassword ||
				localStorage.getItem(slug) === data.project.password
			) {
				setIsAuthenticated(true);
			}
		};

		fetchData();
	}, [slug]);

	const handlePasswordSubmit = () => {
		if (password === projectData.password) {
			localStorage.setItem(slug, password);
			setIsAuthenticated(true);
		} else {
			alert("Incorrect password.");
		}
	};

	if (!projectData) {
		return <div>Loading...</div>;
	}

	if (requiresPassword && !isAuthenticated) {
		return (
			<div className="flex h-screen items-center justify-center">
				<div className="space-y-4">
					<input
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						placeholder="Enter Project Password"
						className="p-2 border border-gray-400 rounded-md"
					/>
					<button
						onClick={handlePasswordSubmit}
						className="btn btn-primary"
					>
						Submit
					</button>
				</div>
			</div>
		);
	}

	// Ensure projectData has an id before rendering EditorUI
	if (!projectData.id) {
		console.error("Project data is missing an ID.");
		return <div>Error: Project ID is missing.</div>;
	}

	return <EditorUI projectData={projectData} />;
}
