import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    let body: any = {};
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, message: "Corpo da requisição inválido" },
        { status: 400 }
      );
    }

    const query = (body.query || body.tema || "").trim();
    const source = (body.source || "all").toLowerCase();

    if (!query) {
      return NextResponse.json(
        { success: false, message: "Por favor, digite um nicho ou palavra-chave" },
        { status: 400 }
      );
    }

    if (!["all", "youtube", "google", "tiktok"].includes(source)) {
      return NextResponse.json(
        { success: false, message: "Fonte inválida" },
        { status: 400 }
      );
    }

    let trends = [];

    if (source === "all" || source === "youtube") {
      trends.push(...generateYouTubeTrends(query));
    }

    if (source === "all" || source === "google") {
      trends.push(...generateGoogleTrends(query));
    }

    if (source === "all" || source === "tiktok") {
      trends.push(...generateTikTokTrends(query));
    }

    // Ordenar por score decrescente
    trends.sort((a, b) => b.score - a.score);

    return NextResponse.json({
      success: true,
      message: `Encontrados ${trends.length} resultados para "${query}"`,
      query,
      source,
      count: trends.length,
      trends,
    }, { status: 200 });

  } catch (error: any) {
    console.error("Erro ao buscar tendências:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Erro ao buscar tendências",
        error: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

function generateYouTubeTrends(query: string) {
  const q = query.charAt(0).toUpperCase() + query.slice(1);
  return [
    {
      id: `yt_${Date.now()}_1`,
      title: `O Segredo Oculto Sobre ${q} Que Ninguém Te Contou`,
      description: `Vídeo com alta taxa de retenção e comentários em massa no YouTube Shorts sobre ${query}.`,
      source: "YouTube Trending",
      sourceKey: "youtube",
      category: "Curiosidades & Fatos",
      score: 98.4,
      trendingPercentage: "+480% hoje",
      growth: "+480% hoje",
      viralityScore: 98.4,
      estimatedViews: "890k views estimadas",
      views: 890000,
      badge: "ULTRA VIRAL",
      url: `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`,
      timestamp: new Date().toISOString(),
    },
    {
      id: `yt_${Date.now()}_2`,
      title: `5 Fatos Inacreditáveis Sobre ${q} Que Vão Explodir Sua Mente`,
      description: `Formato de lista rápida (Listicle) viralizando no algoritmo de recomendação do YouTube.`,
      source: "YouTube Trending",
      sourceKey: "youtube",
      category: "Entretenimento",
      score: 91.2,
      trendingPercentage: "+230% hoje",
      growth: "+230% hoje",
      viralityScore: 91.2,
      estimatedViews: "450k views estimadas",
      views: 450000,
      badge: "EM ALTA",
      url: `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`,
      timestamp: new Date().toISOString(),
    },
  ];
}

function generateGoogleTrends(query: string) {
  const q = query.charAt(0).toUpperCase() + query.slice(1);
  return [
    {
      id: `gg_${Date.now()}_1`,
      title: `Por Que Todos Estão Falando Sobre ${q} Agora? A Revelação Completa`,
      description: `Pico de pesquisas registrado no Google Brasil com mais de 200.000 buscas nas últimas horas.`,
      source: "Google Trends",
      sourceKey: "google",
      category: "Notícias & Atualidades",
      score: 94.7,
      trendingPercentage: "+340% hoje",
      growth: "+340% hoje",
      viralityScore: 94.7,
      estimatedViews: "620k views estimadas",
      views: 620000,
      badge: "EXPLOSÃO DE BUSCAS",
      url: `https://trends.google.com/trends/explore?q=${encodeURIComponent(query)}`,
      timestamp: new Date().toISOString(),
    },
    {
      id: `gg_${Date.now()}_2`,
      title: `A História Real Por Trás de ${q} Que Você Precisa Conhecer`,
      description: `Interesse de busca em ascensão contínua nos últimos 7 dias.`,
      source: "Google Trends",
      sourceKey: "google",
      category: "Documentário & História",
      score: 87.5,
      trendingPercentage: "+150% hoje",
      growth: "+150% hoje",
      viralityScore: 87.5,
      estimatedViews: "310k views estimadas",
      views: 310000,
      badge: "CRESCIMENTO CONSTANTE",
      url: `https://trends.google.com/trends/explore?q=${encodeURIComponent(query)}`,
      timestamp: new Date().toISOString(),
    },
  ];
}

function generateTikTokTrends(query: string) {
  const q = query.charAt(0).toUpperCase() + query.slice(1);
  return [
    {
      id: `tt_${Date.now()}_1`,
      title: `Pov: Você Descobriu a Verdade Sobre ${q} e Nada Mais Faz Sentido`,
      description: `Áudio e roteiro em tendência absoluta no TikTok com alta taxa de compartilhamento.`,
      source: "TikTok Virals",
      sourceKey: "tiktok",
      category: "Viral Stories",
      score: 96.9,
      trendingPercentage: "+520% hoje",
      growth: "+520% hoje",
      viralityScore: 96.9,
      estimatedViews: "1.2M views estimadas",
      views: 1200000,
      badge: "FOR YOU VIRAL",
      url: `https://www.tiktok.com/tag/${encodeURIComponent(query.replace(/\s+/g, ""))}`,
      timestamp: new Date().toISOString(),
    },
    {
      id: `tt_${Date.now()}_2`,
      title: `Se Você Gosta de ${q}, Veja Isto Antes Que Apaguem`,
      description: `Gancho (hook) de alta curiosidade com mais de 80% de conclusão de vídeo.`,
      source: "TikTok Virals",
      sourceKey: "tiktok",
      category: "Mistérios",
      score: 89.3,
      trendingPercentage: "+190% hoje",
      growth: "+190% hoje",
      viralityScore: 89.3,
      estimatedViews: "380k views estimadas",
      views: 380000,
      badge: "ALTO ENGAJAMENTO",
      url: `https://www.tiktok.com/tag/${encodeURIComponent(query.replace(/\s+/g, ""))}`,
      timestamp: new Date().toISOString(),
    },
  ];
}
