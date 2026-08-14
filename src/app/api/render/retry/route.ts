import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { videoId } = body;

    if (!videoId) {
      return NextResponse.json({ error: "Parâmetro 'videoId' é obrigatório" }, { status: 400 });
    }

    const video = await prisma.video.findUnique({ where: { id: videoId } });
    if (!video) {
      return NextResponse.json({ error: "Vídeo não encontrado" }, { status: 404 });
    }

    // Reset video status for re-rendering
    const retriedVideo = await prisma.video.update({
      where: { id: videoId },
      data: {
        status: "rendering",
        progress: 5,
        errorMessage: null,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      status: "SUCCESS",
      message: "Job de renderização reiniciado na fila BullMQ/Inngest",
      video: retriedVideo,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
