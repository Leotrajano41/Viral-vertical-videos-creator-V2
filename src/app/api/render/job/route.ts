import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { projectId, ideaId, priority = 10 } = body;

    if (!projectId || !ideaId) {
      return NextResponse.json({ error: "Parâmetros 'projectId' e 'ideaId' são obrigatórios" }, { status: 400 });
    }

    const project = await prisma.project.findUnique({ where: { id: projectId } });
    const idea = await prisma.idea.findUnique({ where: { id: ideaId } });

    if (!project || !idea) {
      return NextResponse.json({ error: "Projeto ou Ideia não encontrados" }, { status: 404 });
    }

    const jobId = `job_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    // BullMQ Job Payload Structure
    const bullJobPayload = {
      id: jobId,
      projectId: project.id,
      ideaId: idea.id,
      userId: project.userId,
      status: "pending",
      priority,
      attempts: 0,
      maxAttempts: 3,
      backoff: {
        type: "exponential",
        delay: 2000,
      },
      payload: {
        theme: project.theme,
        ideaTitle: idea.title,
        promptMaster: project.promptMaster,
        voiceEngine: project.voiceType,
        format: project.format,
        headlineColor: project.headlineColor,
        musicVolume: project.musicVolume,
      },
    };

    // Update Idea Status
    await prisma.idea.update({
      where: { id: ideaId },
      data: { status: "producing" },
    });

    return NextResponse.json({
      status: "SUCCESS",
      message: "Job de renderização adicionado à fila BullMQ em Redis",
      job: bullJobPayload,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
