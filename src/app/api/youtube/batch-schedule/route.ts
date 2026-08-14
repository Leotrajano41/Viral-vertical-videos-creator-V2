import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { SmartScheduler } from "@/lib/smart-scheduler";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { videoIds = [], videosPerDay = 2, startHour = 9 } = body;

    if (!Array.isArray(videoIds) || videoIds.length === 0) {
      return NextResponse.json(
        { error: "O array 'videoIds' com pelo menos um ID é obrigatório" },
        { status: 400 }
      );
    }

    // Fetch existing booked video timestamps
    const existingScheduled = await prisma.video.findMany({
      where: { status: "scheduled", scheduledAt: { not: null } },
      select: { scheduledAt: true },
    });

    const existingDates = existingScheduled
      .map((v) => v.scheduledAt)
      .filter((d): d is Date => d !== null);

    // Run Smart Batch Scheduler Algorithm
    const calculatedSlots = SmartScheduler.calculateBatchSlots(
      videoIds,
      videosPerDay,
      startHour,
      22,
      existingDates
    );

    // Save scheduled dates to database
    const updatedVideos = await Promise.all(
      calculatedSlots.map((slot) =>
        prisma.video.update({
          where: { id: slot.videoId },
          data: {
            status: "scheduled",
            scheduledAt: slot.scheduledAt,
          },
        })
      )
    );

    return NextResponse.json({
      status: "SUCCESS",
      message: `Agendamento inteligente concluído: ${videoIds.length} vídeos distribuídos (${videosPerDay} por dia a partir das ${startHour}h)`,
      slots: calculatedSlots,
      updatedVideos,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
