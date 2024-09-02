"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import EditorUI from "@/components/EditorUI"; // The main UI component
import { ImSpinner2 } from "react-icons/im"; // Import a spinner icon

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

	// Show loading spinner while project data is being fetched
	if (!projectData) {
		return (
			<div className="flex h-screen items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-700">
				<div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full flex items-center justify-center">
					<ImSpinner2 className="animate-spin text-4xl text-blue-600" />
				</div>
			</div>
		);
	}

	if (requiresPassword && !isAuthenticated) {
		return (
			<div className="flex h-screen items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-700">
				<div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full text-center">
					<h2 className="text-2xl font-semibold mb-4 text-gray-800">
						Project Password Required
					</h2>
					<p className="text-gray-600 mb-6">
						Please enter the project password to access this
						project.
					</p>
					<input
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						placeholder="Enter Project Password"
						className="w-full p-3 border border-gray-300 rounded-md mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
					<p className="text-sm text-gray-500 mb-6">
						Default password is{" "}
						<span className="font-semibold">password123</span>. You
						can change it in the settings.
					</p>
					<button
						onClick={handlePasswordSubmit}
						className="w-full py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transition"
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
