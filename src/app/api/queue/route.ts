import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const whereCondition: any = {};
    if (status) {
      whereCondition.status = status;
    }

    const videos = await prisma.video.findMany({
      where: whereCondition,
      include: {
        project: {
          select: { name: true, niche: true },
        },
        idea: {
          select: { title: true, description: true },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    const summary = {
      queued: videos.filter((v) => v.status === "draft" || v.status === "rendering").length,
      completed: videos.filter((v) => v.status === "rendered" || v.status === "published").length,
      failed: videos.filter((v) => v.status === "error").length,
      total: videos.length,
    };

    return NextResponse.json({
      status: "SUCCESS",
      summary,
      jobs: videos,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
