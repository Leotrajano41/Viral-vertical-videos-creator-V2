import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const documents = await prisma.projectFolder.findMany({
      where: {
        projectId: params.id,
        type: "knowledge",
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ status: "SUCCESS", documents });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { searchParams } = new URL(request.url);
    const docId = searchParams.get("docId");

    if (!docId) {
      return NextResponse.json({ error: "Parâmetro 'docId' é obrigatório" }, { status: 400 });
    }

    const deleted = await prisma.projectFolder.delete({
      where: { id: docId },
    });

    return NextResponse.json({ status: "SUCCESS", message: "Documento e vetores removidos do sistema", deleted });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
