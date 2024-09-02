import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
	req: Request,
	{ params }: { params: { id: string } },
) {
	let data;
	try {
		data = await req.json(); // Parsing the JSON data from the request
	} catch (error) {
		console.error("Failed to parse JSON:", error);
		return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
	}

	const { code, settings } = data;

	// Debugging: Log the received code to verify its type and value
	console.log("Received code:", code);

	// Ensure code is stored as a string
	let codeString = "";

	if (typeof code === "string") {
		codeString = code;
	} else if (typeof code === "object" && code !== null) {
		codeString = JSON.stringify(code); // Convert object to a JSON string
	} else if (Array.isArray(code)) {
		codeString = code.join(""); // Join array elements into a string
	} else {
		codeString = String(code); // Fallback: Convert anything else to a string
	}

	// Debugging: Log the final code string before saving
	console.log("Processed codeString:", codeString);

	try {
		const project = await prisma.project.update({
			where: { id: params.id },
			data: {
				code: codeString, // Save the string version of the code
				settings: {
					theme: settings.theme,
					extensions: settings.extensions,
					tabSize: settings.tabSize,
					useTabs: settings.useTabs,
					editorVisibility: settings.editorVisibility,
					projectPassword: settings.projectPassword,
				},
			},
		});

		return NextResponse.json(project);
	} catch (error) {
		console.error("Error updating project:", error);
		return NextResponse.json(
			{ error: "Failed to update project" },
			{ status: 500 },
		);
	}
}
