"use client";

import React, { useState } from "react";
import { Search, Flame, PlusCircle, ExternalLink, Loader2, CheckCircle2 } from "lucide-react";

export default function DiscoveryPage() {
  const [topic, setTopic] = useState("Tecnologia");
  const [source, setSource] = useState("all");
  const [country, setCountry] = useState("BR");
  const [loading, setLoading] = useState(false);
  const [creatingId, setCreatingId] = useState<string | null>(null);
  const [createdProjects, setCreatedProjects] = useState<Record<string, boolean>>({});

  const [trends, setTrends] = useState([
    {
      id: "trend_yt_1",
      title: "GTA 6 vaza novo trailer com gráficos foto-realistas e mapa gigante",
      source: "YouTube Trends",
      url: "https://youtube.com",
      views: 890000,
      viralityScore: 98.4,
    },
    {
      id: "trend_news_2",
      title: "Nova Inteligência Artificial supera humanos em testes complexos de raciocínio",
      source: "Google News",
      url: "https://news.google.com",
      views: 410000,
      viralityScore: 86.2,
    },
  ]);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/trends/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tema: topic, source, country }),
      });
      const data = await res.json();
      if (data.trends) {
        setTrends(data.trends);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateProject(item: any) {
    setCreatingId(item.id);
    try {
      const res = await fetch("/api/projects/from-trend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trendId: item.id,
          trendTitle: item.title,
          source: item.source,
        }),
      });
      if (res.ok) {
        setCreatedProjects((prev) => ({ ...prev, [item.id]: true }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCreatingId(null);
    }
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Flame className="text-amber-500" />
            Descoberta de Assuntos Virais (Web API)
          </h1>
          <p className="text-xs text-gray-400">Busca multi-fonte com scoring de viralidade e cache em Redis</p>
        </div>

        <form onSubmit={handleSearch} className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Tema (ex: GTA 6, Bayern)..."
              className="pl-9 pr-4 py-2 bg-surface border border-border rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="px-3 py-2 bg-surface border border-border rounded-lg text-sm text-white focus:outline-none"
          >
            <option value="BR">Brasil (PT)</option>
            <option value="US">EUA (EN)</option>
            <option value="ES">Espanha (ES)</option>
          </select>

          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition flex items-center gap-2"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : "Buscar"}
          </button>
        </form>
      </div>

      <div className="space-y-3">
        {trends.map((item) => (
          <div key={item.id} className="bg-surface border border-border p-4 rounded-xl flex items-center justify-between gap-4 hover:border-gray-700 transition">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 rounded-md border border-emerald-500/20">
                  Virality Score: {item.viralityScore}
                </span>
                <span className="text-xs text-gray-400">• {item.source}</span>
              </div>
              <h3 className="text-sm font-semibold text-white">{item.title}</h3>
              <p className="text-xs text-gray-400">Visualizações estimadas: {item.views.toLocaleString()}</p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <a
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="p-2 text-gray-400 hover:text-white bg-background border border-border rounded-lg"
              >
                <ExternalLink size={16} />
              </a>

              {createdProjects[item.id] ? (
                <span className="flex items-center gap-1.5 px-3 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg text-xs font-semibold">
                  <CheckCircle2 size={15} />
                  Projeto Criado
                </span>
              ) : (
                <button
                  onClick={() => handleCreateProject(item)}
                  disabled={creatingId === item.id}
                  className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition disabled:opacity-50"
                >
                  {creatingId === item.id ? <Loader2 size={15} className="animate-spin" /> : <PlusCircle size={15} />}
                  + Projeto
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
