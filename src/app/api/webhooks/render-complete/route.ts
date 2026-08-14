import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { videoId, s3VideoUrl, status = "rendered", errorMessage } = body;

    if (!videoId) {
      return NextResponse.json({ error: "Parâmetro 'videoId' é obrigatório" }, { status: 400 });
    }

    const updatedVideo = await prisma.video.update({
      where: { id: videoId },
      data: {
        status,
        progress: status === "rendered" ? 100 : 0,
        videoUrl: s3VideoUrl,
        errorMessage: errorMessage || null,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      status: "SUCCESS",
      message: "Webhook de conclusão de renderização processado com sucesso",
      video: updatedVideo,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
