"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AiOutlineFileAdd, AiOutlineFolderOpen } from "react-icons/ai";
import { ImSpinner2 } from "react-icons/im"; // Import a spinner icon

export default function Home() {
	const router = useRouter();
	const [loading, setLoading] = useState(false); // State to manage loading spinner

	const createNewProject = async () => {
		setLoading(true); // Show the loading spinner

		const res = await fetch("/api/project/create", {
			method: "POST",
			body: JSON.stringify({
				code: "",
				settings: {},
				type: "private",
				password: "password123",
			}),
			headers: { "Content-Type": "application/json" },
		});

		const project = await res.json();
		router.push(`/${project.id}/editor`);
	};

	return (
		<div className="flex h-screen items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-900">
			<div className="text-center bg-white p-10 rounded-lg shadow-lg max-w-md mx-auto">
				<h1 className="text-4xl font-bold mb-6 text-gray-800">
					Welcome to WebCode
				</h1>
				<p className="text-gray-600 mb-8">
					Create and manage your coding projects effortlessly. Get
					started by creating a new project or open an existing one.
				</p>
				<div className="space-y-4">
					{/* Conditionally render the button or the loading spinner */}
					{loading ? (
						<div className="flex items-center justify-center w-full">
							<ImSpinner2 className="animate-spin text-4xl text-blue-600" />
						</div>
					) : (
						<>
							<button
								onClick={createNewProject}
								className="flex items-center justify-center w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 transition"
							>
								<AiOutlineFileAdd className="mr-2 text-2xl" />
								Create New Project
							</button>
							<button
								onClick={() =>
									router.push("/existing-projects")
								}
								className="flex items-center justify-center w-full px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-md shadow-md hover:bg-gray-300 transition"
							>
								<AiOutlineFolderOpen className="mr-2 text-2xl" />
								Open Existing Project
							</button>
						</>
					)}
				</div>
			</div>
		</div>
	);
}
