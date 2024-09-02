import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
	req: Request,
	{ params }: { params: { id: string } },
) {
	const project = await prisma.project.findUnique({
		where: { id: params.id },
	});

	if (!project) {
		return NextResponse.json(
			{ error: "Project not found" },
			{ status: 404 },
		);
	}

	// Parse the code JSON string into an array
	let code = [];
	try {
		code = JSON.parse(project.code || "[]");
	} catch (error) {
		console.error("Failed to parse project code:", error);
		return NextResponse.json(
			{ error: "Failed to parse project code" },
			{ status: 500 },
		);
	}

	// Return the project with the parsed code
	const requiresPassword = project.type !== "public";
	return NextResponse.json({
		project: { ...project, code },
		requiresPassword,
	});
}
