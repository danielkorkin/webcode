import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
	try {
		const { code, settings, type, password } = await req.json();

		const project = await prisma.project.create({
			data: {
				code,
				settings,
				type,
				password,
			},
		});

		return NextResponse.json(project);
	} catch (error) {
		console.error("Error creating project:", error);
		return NextResponse.json(
			{ error: "Failed to create project" },
			{ status: 500 },
		);
	}
}
