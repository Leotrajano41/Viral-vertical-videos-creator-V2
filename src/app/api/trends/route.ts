import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const topic = searchParams.get("topic") || "tecnologia";
  const country = searchParams.get("country") || "BR";

  // Simulated serverless trend items matching virality math
  const trends = [
    {
      id: "t1",
      title: `Últimas tendências sobre ${topic} no país ${country}`,
      source: "Google News API",
      url: `https://news.google.com/search?q=${topic}`,
      views: 520000,
      viralityScore: 92.5,
    },
    {
      id: "t2",
      title: `Vídeo em alta no YouTube Shorts: O futuro de ${topic}`,
      source: "YouTube Data API v3",
      url: `https://youtube.com/results?search_query=${topic}`,
      views: 310000,
      viralityScore: 81.0,
    },
  ];

  return NextResponse.json({ status: "SUCCESS", topic, country, trends });
}
