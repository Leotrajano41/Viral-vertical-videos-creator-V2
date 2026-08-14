import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { llmOrchestrator } from "@/lib/llm-orchestrator";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { ideaIds = [] } = body;

    if (!Array.isArray(ideaIds) || ideaIds.length === 0) {
      return NextResponse.json({ error: "O array 'ideaIds' com pelo menos um ID é obrigatório" }, { status: 400 });
    }

    const producedVideos = [];

    for (const ideaId of ideaIds) {
      const idea = await prisma.idea.findUnique({
        where: { id: ideaId },
        include: { project: true },
      });

      if (!idea) continue;

      // Update idea status to 'producing'
      await prisma.idea.update({
        where: { id: ideaId },
        data: { status: "producing" },
      });

      // Generate Script, Headline, and SEO metadata via LLM Orchestrator
      const scriptPayload = await llmOrchestrator.generateScriptAndSEO(
        idea.project.promptMaster,
        idea.title,
        idea.description
      );

      // Create Video Record in Database with status 'rendering'
      const video = await prisma.video.create({
        data: {
          projectId: idea.projectId,
          ideaId: idea.id,
          title: scriptPayload.seo.title,
          description: scriptPayload.seo.description,
          tags: JSON.stringify(scriptPayload.seo.tags),
          status: "rendering",
          progress: 10,
          videoUrl: `s3://viral-creator-bucket/videos/${idea.id}.mp4`,
        },
      });

      producedVideos.push(video);
    }

    return NextResponse.json({
      status: "SUCCESS",
      message: `${producedVideos.length} vídeos colocados na fila de produção e renderização em lote`,
      videos: producedVideos,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
