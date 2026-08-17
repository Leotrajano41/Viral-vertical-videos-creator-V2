"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Flame,
  Search,
  Zap,
  TrendingUp,
  Sparkles,
  AlertCircle,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { ModernButton } from "@/components/ui/modern/Button";
import Link from "next/link";

interface TrendItem {
  id: string;
  title: string;
  description?: string;
  source: string;
  sourceKey?: string;
  viralityScore?: number;
  score?: number;
  views?: number;
  estimatedViews?: string;
  badge?: string;
  growth?: string;
  trendingPercentage?: string;
  category: string;
  url?: string;
}

export default function TrendsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSource, setSelectedSource] = useState("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchedKeyword, setSearchedKeyword] = useState("Em Alta no Brasil");

  const [trends, setTrends] = useState<TrendItem[]>([
    {
      id: "1",
      title: "NOVO TRAILER VAZADO: GTA 6 revela mapa gigante e gráficos ultra realistas",
      source: "YouTube Trending",
      viralityScore: 98.4,
      score: 98.4,
      views: 890000,
      estimatedViews: "890k views estimadas",
      badge: "ULTRA VIRAL",
      growth: "+320% hoje",
      trendingPercentage: "+320% hoje",
      category: "Games",
      url: "https://www.youtube.com",
    },
    {
      id: "2",
      title: "Anúncio Surpresa da RockStar Games para o lançamento global",
      source: "Google Trends",
      viralityScore: 92.1,
      score: 92.1,
      views: 450000,
      estimatedViews: "450k views estimadas",
      badge: "EM ALTA",
      growth: "+180% hoje",
      trendingPercentage: "+180% hoje",
      category: "Entretenimento",
      url: "https://trends.google.com",
    },
    {
      id: "3",
      title: "Comparativo Gráfico Definitivo: GTA 5 vs GTA 6 no PS5 Pro",
      source: "TikTok Virals",
      viralityScore: 88.7,
      score: 88.7,
      views: 295000,
      estimatedViews: "295k views estimadas",
      badge: "RECOMENDADO",
      growth: "+95% hoje",
      trendingPercentage: "+95% hoje",
      category: "Tecnologia",
      url: "https://www.tiktok.com",
    },
    {
      id: "4",
      title: "Músicas e Rádios confirmadas na trilha sonora de Vice City",
      source: "Web Search",
      viralityScore: 84.3,
      score: 84.3,
      views: 180000,
      estimatedViews: "180k views estimadas",
      badge: "CRESCENDO",
      growth: "+65% hoje",
      trendingPercentage: "+65% hoje",
      category: "Música",
      url: "https://www.google.com",
    },
  ]);

  const handleSearchTrends = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!searchQuery.trim()) {
      setError("Por favor, digite um nicho ou palavra-chave (ex: histórias bíblicas, curiosidades)");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/trends/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: searchQuery.trim(),
          source: selectedSource,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success && Array.isArray(data.trends)) {
        setTrends(data.trends);
        setSearchedKeyword(searchQuery.trim());
        setError("");
      } else {
        setError(data.message || "Erro ao buscar tendências. Tente novamente.");
      }
    } catch (err) {
      console.error("Erro ao buscar tendências:", err);
      setError("Falha na conexão ao buscar tendências. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Header Banner */}
      <div className="glass-card rounded-3xl p-8 border border-white/10 relative overflow-hidden bg-gradient-to-r from-amber-900/40 via-purple-900/30 to-indigo-900/40">
        <div className="flex items-center gap-4 mb-2">
          <div className="p-3.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Flame size={28} />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white">
              Radar de Tendências Virais
            </h1>
            <p className="text-xs text-gray-300 mt-1">
              Monitore os tópicos mais buscados no YouTube, TikTok e Google para surfar ondas virais
            </p>
          </div>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <form
        onSubmit={handleSearchTrends}
        className="glass-card rounded-2xl p-4 md:p-5 border border-white/10 flex flex-col md:flex-row gap-4 items-center justify-between"
      >
        <div className="flex-1 flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 w-full focus-within:border-amber-500/50 transition">
          <Search size={18} className="text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (error) setError("");
            }}
            placeholder="Digite um nicho ou palavra-chave (ex: histórias bíblicas, curiosidades, crimes reais)..."
            className="bg-transparent text-sm text-white placeholder-gray-400 focus:outline-none w-full font-medium"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={selectedSource}
            onChange={(e) => setSelectedSource(e.target.value)}
            className="bg-white/5 border border-white/10 text-xs font-semibold text-gray-300 rounded-xl px-3.5 py-3 focus:outline-none cursor-pointer"
          >
            <option value="all">🌐 Todas as Fontes</option>
            <option value="youtube">📺 YouTube Trending</option>
            <option value="google">🔍 Google Trends</option>
            <option value="tiktok">📱 TikTok Virals</option>
          </select>

          <ModernButton
            type="submit"
            variant="primary"
            size="md"
            className="w-full md:w-auto whitespace-nowrap"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Buscando...
              </>
            ) : (
              <>
                <Search size={16} /> Buscar Tendências
              </>
            )}
          </ModernButton>
        </div>
      </form>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 font-semibold flex items-center gap-2"
          >
            <AlertCircle size={16} className="text-rose-400 flex-shrink-0" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results Header */}
      <div className="flex items-center justify-between px-1">
        <h2 className="text-sm font-bold text-gray-300 flex items-center gap-2">
          <Sparkles size={16} className="text-amber-400" /> Resultados para:{" "}
          <span className="text-white font-extrabold">{searchedKeyword}</span> ({trends.length})
        </h2>
      </div>

      {/* Results Grid */}
      {trends.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {trends.map((item, idx) => {
            const scoreVal = item.score ?? item.viralityScore ?? 90;
            const growthText = item.growth || item.trendingPercentage || "+250% hoje";
            const viewsText = item.estimatedViews || `${((item.views || 300000) / 1000).toFixed(0)}k views estimadas`;

            return (
              <motion.div
                key={item.id || idx}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="glass-card rounded-2xl p-6 border border-white/10 hover:border-amber-500/40 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-1 text-[10px] font-extrabold rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      {item.badge || "VIRAL"}
                    </span>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-emerald-400 font-bold">{growthText}</span>
                      <div className="flex items-center gap-1 font-bold text-cyan-400">
                        <TrendingUp size={14} />
                        <span>Score: {scoreVal}</span>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition line-clamp-2">
                    {item.title}
                  </h3>

                  {item.description && (
                    <p className="text-xs text-gray-400 mt-2 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  )}

                  <div className="mt-3 text-xs text-gray-400 flex items-center justify-between pt-2 border-t border-white/5">
                    <span>Fonte: <strong>{item.source}</strong></span>
                    <span>{viewsText}</span>
                  </div>
                </div>

                <div className="pt-5 border-t border-white/10 mt-5 flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-400">{item.category}</span>

                  <div className="flex items-center gap-2">
                    {item.url && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition"
                        title="Ver Fonte Original"
                      >
                        <ExternalLink size={14} />
                      </a>
                    )}

                    <Link href="/create-videos">
                      <ModernButton variant="primary" size="sm">
                        <Zap size={14} /> + Criar Vídeo
                      </ModernButton>
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="glass-card rounded-2xl p-12 text-center border border-white/10 space-y-3">
          <p className="text-gray-400 text-sm font-medium">Nenhuma tendência encontrada para esta busca.</p>
          <p className="text-gray-500 text-xs">Tente buscar por termos mais amplos como &quot;curiosidades&quot;, &quot;futebol&quot;, &quot;tecnologia&quot; ou &quot;histórias&quot;.</p>
        </div>
      )}
    </div>
  );
}
