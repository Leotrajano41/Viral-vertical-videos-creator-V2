import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId") || "user_default";

    const projects = await prisma.project.findMany({
      where: {
        userId,
        deletedAt: null,
      },
      include: {
        folders: true,
        voice: true,
        _count: {
          select: { ideas: true, videos: true },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({ status: "SUCCESS", projects });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      niche,
      theme,
      language = "pt",
      country = "BR",
      durationMin = 25,
      durationMax = 40,
      format = "9:16",
      promptMaster,
      template = "breaking_news",
      voiceType = "edge_tts",
      voiceId,
      headlineColor = "yellow",
      ctaText,
      musicMode = "random",
      musicVolume = 0.30,
      email = "usuario@viralcreator.com",
    } = body;

    if (!name || !niche || !theme || !promptMaster) {
      return NextResponse.json({ error: "Campos obrigatórios ausentes (name, niche, theme, promptMaster)" }, { status: 400 });
    }

    // Ensure User exists
    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name: "Usuário Criador",
          credits: 50,
        },
      });
    }

    // Create Project in Database
    const project = await prisma.project.create({
      data: {
        userId: user.id,
        name,
        niche,
        theme,
        language,
        country,
        durationMin,
        durationMax,
        format,
        promptMaster,
        template,
        voiceType,
        voiceId,
        headlineColor,
        ctaText,
        musicMode,
        musicVolume,
        // Auto-create 5 Project Folders for Cloud S3 Storage
        folders: {
          create: [
            { type: "videos", s3Path: `s3://bucket/users/${user.id}/projects/${name}/videos/` },
            { type: "music", s3Path: `s3://bucket/users/${user.id}/projects/${name}/music/` },
            { type: "knowledge", s3Path: `s3://bucket/users/${user.id}/projects/${name}/knowledge/` },
            { type: "output", s3Path: `s3://bucket/users/${user.id}/projects/${name}/output/` },
            { type: "cta", s3Path: `s3://bucket/users/${user.id}/projects/${name}/cta/` },
          ],
        },
      },
      include: {
        folders: true,
        voice: true,
      },
    });

    return NextResponse.json({ status: "SUCCESS", project });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
