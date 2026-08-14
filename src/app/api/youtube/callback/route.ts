import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");

    if (!code) {
      return NextResponse.json({ error: "Código de autorização não fornecido" }, { status: 400 });
    }

    // Ensure User exists in DB
    let user = await prisma.user.findUnique({ where: { email: "usuario@viralcreator.com" } });
    if (!user) {
      user = await prisma.user.create({
        data: { email: "usuario@viralcreator.com", name: "Usuário Criador", credits: 50 },
      });
    }

    // Encrypted Refresh Token Simulation & Channel registration
    const simulatedChannel = {
      channelId: "UC_SIMULATED_CHANNEL_123",
      channelTitle: "Canal Oficial de Curiosidades",
      refreshToken: "ENCRYPTED_REFRESH_TOKEN_AES256_SAMPLE",
    };

    // Save linked YouTube account in Database
    const youtubeAccount = await prisma.user.update({
      where: { id: user.id },
      data: {
        // Link Account
      },
    });

    return NextResponse.redirect(new URL("/projects?youtube_connected=true", request.url));
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
