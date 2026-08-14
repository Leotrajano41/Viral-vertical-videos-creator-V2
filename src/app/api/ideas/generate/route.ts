import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { llmOrchestrator } from "@/lib/llm-orchestrator";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { projectId } = body;

    if (!projectId) {
      return NextResponse.json({ error: "Parâmetro 'projectId' é obrigatório" }, { status: 400 });
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { folders: true },
    });

    if (!project) {
      return NextResponse.json({ error: "Projeto não encontrado" }, { status: 404 });
    }

    // Context RAG Simulation
    const contextRAG = "Estudo de material indexado: Fatos históricos, estatísticas e vazamentos recentes.";

    // Generate 10 viral ideas using LLM Orchestrator
    const rawIdeas = await llmOrchestrator.generateIdeas(project.promptMaster, project.theme, contextRAG);

    // Save generated ideas to database with status 'pending'
    const createdIdeas = await Promise.all(
      rawIdeas.map((idea) =>
        prisma.idea.create({
          data: {
            projectId: project.id,
            title: idea.title,
            description: idea.description,
            status: "pending",
          },
        })
      )
    );

    return NextResponse.json({
      status: "SUCCESS",
      count: createdIdeas.length,
      ideas: createdIdeas,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
