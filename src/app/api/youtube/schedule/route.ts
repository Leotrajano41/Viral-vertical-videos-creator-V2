import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { videoId, targetDate } = body;

    if (!videoId) {
      return NextResponse.json({ error: "Parâmetro 'videoId' é obrigatório" }, { status: 400 });
    }

    const video = await prisma.video.findUnique({ where: { id: videoId } });
    if (!video) {
      return NextResponse.json({ error: "Vídeo não encontrado" }, { status: 404 });
    }

    const scheduledTime = targetDate ? new Date(targetDate) : new Date(Date.now() + 3600 * 1000 * 2);
    const hour = scheduledTime.getHours();

    let adjustedTime = scheduledTime;
    let warning = null;

    // Enforce Restriction: Never publish between 22:00 PM and 06:00 AM local time
    if (hour >= 22 || hour < 6) {
      adjustedTime = new Date(scheduledTime);
      adjustedTime.setHours(6, 0, 0, 0);
      if (hour >= 22) {
        adjustedTime.setDate(adjustedTime.getDate() + 1);
      }
      warning = "Horário solicitado estava na janela da madrugada (22h-06h). Reagendado automaticamente para às 06:00 AM.";
    }

    const scheduledVideo = await prisma.video.update({
      where: { id: videoId },
      data: {
        status: "scheduled",
        scheduledAt: adjustedTime,
      },
    });

    return NextResponse.json({
      status: "SUCCESS",
      message: "Vídeo agendado para publicação oficial no YouTube Shorts",
      scheduledAt: adjustedTime.toISOString(),
      warning,
      video: scheduledVideo,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
