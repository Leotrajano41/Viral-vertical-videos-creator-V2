import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId") || "user_default";

    const voices = await prisma.voice.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ status: "SUCCESS", voices });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, sampleUrl, voiceModel, email = "usuario@viralcreator.com" } = body;

    if (!name || !sampleUrl) {
      return NextResponse.json({ error: "Nome e URL do áudio de amostra são obrigatórios" }, { status: 400 });
    }

    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      user = await prisma.user.create({
        data: { email, name: "Usuário Criador", credits: 50 },
      });
    }

    const voice = await prisma.voice.create({
      data: {
        userId: user.id,
        name,
        sampleUrl,
        voiceModel,
      },
    });

    return NextResponse.json({ status: "SUCCESS", voice });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
