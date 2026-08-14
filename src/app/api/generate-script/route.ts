import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { ideaTitle, masterPrompt } = body;

    if (!ideaTitle) {
      return NextResponse.json({ error: "Título da ideia é obrigatório" }, { status: 400 });
    }

    // Multi-LLM Simulated Output for Web API Route
    const scriptPayload = {
      hook: `Você sabia disso sobre ${ideaTitle}?`,
      fullScript: `Você sabia disso sobre ${ideaTitle}? É algo que poucos conhecem, mas que altera totalmente nossa percepção. Especialistas revelaram detalhes inéditos e o resultado é impressionante. Deixe seu comentário e siga o canal para mais!`,
      headline: `${ideaTitle.toUpperCase()} REVELADO!`,
      seo: {
        title: `${ideaTitle} - O Segredo Revelado! #shorts`,
        description: `Confira os principais fatos sobre ${ideaTitle} neste vídeo curto.`,
        tags: [ideaTitle, "curiosidades", "viral", "shorts"],
      },
    };

    return NextResponse.json({ status: "SUCCESS", script: scriptPayload });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
