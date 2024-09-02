// src/app/api/project/[id]/route.ts
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

	// Indicate if the password is required (for existing projects)
	const requiresPassword = project.type !== "public";

	return NextResponse.json({
		project,
		requiresPassword,
	});
}
