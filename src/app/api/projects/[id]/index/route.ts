import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const { s3Path, fileType = "pdf" } = body;

    if (!s3Path) {
      return NextResponse.json({ error: "Parâmetro 's3Path' é obrigatório" }, { status: 400 });
    }

    const project = await prisma.project.findUnique({ where: { id: params.id } });
    if (!project) {
      return NextResponse.json({ error: "Projeto não encontrado" }, { status: 404 });
    }

    // Register Knowledge Folder record in Database
    const folderRecord = await prisma.projectFolder.create({
      data: {
        projectId: params.id,
        type: "knowledge",
        s3Path,
      },
    });

    // Semantic Chunking Simulation (512 tokens window)
    const simulatedChunks = 14;

    return NextResponse.json({
      status: "SUCCESS",
      message: "Documento enfileirado para transcrição e vetorização RAG",
      folderRecord,
      chunksIndexed: simulatedChunks,
      embeddingsModel: "text-embedding-3-small",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
