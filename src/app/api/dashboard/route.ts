import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId") || "user_default";

    const user = await prisma.user.findFirst({
      where: { email: "usuario@viralcreator.com" },
    });

    const projectsCount = await prisma.project.count({
      where: { deletedAt: null },
    });

    const videos = await prisma.video.findMany();

    const metrics = {
      videosCompleted: videos.filter((v) => v.status === "rendered" || v.status === "published").length,
      videosInQueue: videos.filter((v) => v.status === "draft" || v.status === "rendering" || v.status === "scheduled").length,
      videosFailed: videos.filter((v) => v.status === "error").length,
      activeProjects: projectsCount,
      creditsBalance: user?.credits || 50,
      planTier: user?.plan || "free",
    };

    return NextResponse.json({ status: "SUCCESS", metrics });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
