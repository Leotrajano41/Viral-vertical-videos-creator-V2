import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { trendId, trendTitle, source, userId = "user_default" } = body;

    if (!trendTitle) {
      return NextResponse.json({ error: "O parâmetro 'trendTitle' é obrigatório." }, { status: 400 });
    }

    // Certifica a existência de um Usuário no DB
    let user = await prisma.user.findUnique({ where: { email: "usuario@viralcreator.com" } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: "usuario@viralcreator.com",
          name: "Usuário Criador",
          credits: 50,
        },
      });
    }

    // Cria o Projeto pré-preenchido baseado na tendência pesquisada
    const project = await prisma.project.create({
      data: {
        userId: user.id,
        name: `Projeto: ${trendTitle.slice(0, 30)}...`,
        niche: "Tendências em Alta",
        theme: trendTitle,
        language: "pt",
        country: "BR",
        durationMin: 25,
        durationMax: 40,
        format: "9:16",
        promptMaster: `Você é um especialista em conteúdo viral para Shorts/TikTok. Crie um roteiro ultra envolvente sobre: ${trendTitle}.`,
        template: "breaking_news",
        voiceType: "edge_tts",
        headlineColor: "yellow",
        musicMode: "random",
        musicVolume: 0.30,
        folders: {
          create: [
            { type: "videos", s3Path: `s3://bucket/users/${user.id}/projects/${trendTitle.slice(0, 15)}/videos/` },
            { type: "music", s3Path: `s3://bucket/users/${user.id}/projects/${trendTitle.slice(0, 15)}/music/` },
            { type: "knowledge", s3Path: `s3://bucket/users/${user.id}/projects/${trendTitle.slice(0, 15)}/knowledge/` },
            { type: "output", s3Path: `s3://bucket/users/${user.id}/projects/${trendTitle.slice(0, 15)}/output/` },
            { type: "cta", s3Path: `s3://bucket/users/${user.id}/projects/${trendTitle.slice(0, 15)}/cta/` },
          ],
        },
      },
      include: {
        folders: true,
        voice: true,
      },
    });

    return NextResponse.json({
      status: "SUCCESS",
      message: "Projeto criado com sucesso a partir da tendência estudada",
      project,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
