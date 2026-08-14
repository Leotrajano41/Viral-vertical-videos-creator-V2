import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const sourceProject = await prisma.project.findUnique({
      where: { id: params.id },
      include: { folders: true },
    });

    if (!sourceProject) {
      return NextResponse.json({ error: "Projeto de origem não encontrado" }, { status: 404 });
    }

    // Duplicate project and auto-create folders
    const clonedProject = await prisma.project.create({
      data: {
        userId: sourceProject.userId,
        name: `${sourceProject.name} (Cópia)`,
        niche: sourceProject.niche,
        theme: sourceProject.theme,
        language: sourceProject.language,
        country: sourceProject.country,
        durationMin: sourceProject.durationMin,
        durationMax: sourceProject.durationMax,
        format: sourceProject.format,
        promptMaster: sourceProject.promptMaster,
        template: sourceProject.template,
        voiceType: sourceProject.voiceType,
        voiceId: sourceProject.voiceId,
        headlineColor: sourceProject.headlineColor,
        ctaText: sourceProject.ctaText,
        musicMode: sourceProject.musicMode,
        musicVolume: sourceProject.musicVolume,
        folders: {
          create: [
            { type: "videos", s3Path: `s3://bucket/users/${sourceProject.userId}/projects/${sourceProject.name}_cloned/videos/` },
            { type: "music", s3Path: `s3://bucket/users/${sourceProject.userId}/projects/${sourceProject.name}_cloned/music/` },
            { type: "knowledge", s3Path: `s3://bucket/users/${sourceProject.userId}/projects/${sourceProject.name}_cloned/knowledge/` },
            { type: "output", s3Path: `s3://bucket/users/${sourceProject.userId}/projects/${sourceProject.name}_cloned/output/` },
            { type: "cta", s3Path: `s3://bucket/users/${sourceProject.userId}/projects/${sourceProject.name}_cloned/cta/` },
          ],
        },
      },
      include: {
        folders: true,
        voice: true,
      },
    });

    return NextResponse.json({ status: "SUCCESS", clonedProject });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
