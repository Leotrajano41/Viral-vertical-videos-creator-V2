import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { videoId, youtubeVideoId, publishedUrl, status = "published" } = body;

    if (!videoId || !youtubeVideoId) {
      return NextResponse.json(
        { error: "Parâmetros 'videoId' e 'youtubeVideoId' são obrigatórios" },
        { status: 400 }
      );
    }

    // Update Video Record in Database
    const updatedVideo = await prisma.video.update({
      where: { id: videoId },
      data: {
        status,
        youtubeVideoId,
        videoUrl: publishedUrl || undefined,
        publishedAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      status: "SUCCESS",
      message: "Status do vídeo atualizado para PUBLISHED via Webhook com sucesso",
      video: updatedVideo,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
