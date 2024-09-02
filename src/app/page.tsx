"use client";

import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

export default function Home() {
	const router = useRouter();

	const createNewProject = async () => {
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
		<div className="flex h-screen items-center justify-center">
			<div>
				<button onClick={createNewProject} className="btn btn-primary">
					Create New Project
				</button>
				<button
					onClick={() => router.push("/existing-projects")}
					className="btn btn-secondary"
				>
					Open Existing Project
				</button>
			</div>
		</div>
	);
}
