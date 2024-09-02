import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
	req: Request,
	{ params }: { params: { id: string } },
) {
	let data;
	try {
		data = await req.json(); // This is where the error occurs if the JSON is invalid
	} catch (error) {
		console.error("Failed to parse JSON:", error);
		return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
	}

	const { code, settings } = data;

	const codeString = Array.isArray(code) ? code.join("") : code; // Ensure it's a string

	try {
		const project = await prisma.project.update({
			where: { id: params.id },
			data: {
				code: codeString, // Pass the string version of code
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
