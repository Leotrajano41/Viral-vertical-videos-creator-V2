"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Flame,
  Search,
  Globe,
  Plus,
  Sparkles,
  TrendingUp,
  Youtube,
  Radio,
  ExternalLink,
  Zap,
} from "lucide-react";
import { ModernButton } from "@/components/ui/modern/Button";
import Link from "next/link";

export default function TrendsPage() {
  const [tema, setTema] = useState("GTA 6");
  const [loading, setLoading] = useState(false);
  const [selectedSource, setSelectedSource] = useState("all");

  const [trends, setTrends] = useState([
    {
      id: "1",
      title: "NOVO TRAILER VAZADO: GTA 6 revela mapa gigante e gráficos ultra realistas",
      source: "YouTube Trends",
      viralityScore: 98.4,
      views: 890000,
      badge: "ULTRA VIRAL",
      growth: "+320% hoje",
      category: "Games",
    },
    {
      id: "2",
      title: "Anúncio Surpresa da RockStar Games para o lançamento global",
      source: "Google Trends",
      viralityScore: 92.1,
      views: 450000,
      badge: "EM ALTA",
      growth: "+180% hoje",
      category: "Entretenimento",
    },
    {
      id: "3",
      title: "Comparativo Gráfico Definitivo: GTA 5 vs GTA 6 no PS5 Pro",
      source: "TikTok Trends",
      viralityScore: 88.7,
      views: 295000,
      badge: "RECOMENDADO",
      growth: "+95% hoje",
      category: "Tecnologia",
    },
    {
      id: "4",
      title: "Músicas e Rádios confirmadas na trilha sonora de Vice City",
      source: "Web Search",
      viralityScore: 84.3,
      views: 180000,
      badge: "CRESCENDO",
      growth: "+65% hoje",
      category: "Música",
    },
  ]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 600);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="glass-card rounded-3xl p-8 border border-white/10 relative overflow-hidden bg-gradient-to-r from-amber-900/40 via-purple-900/30 to-indigo-900/40">
        <div className="flex items-center gap-4 mb-2">
          <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Flame size={28} />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white">
              Radar de Tendências Virais
            </h1>
            <p className="text-xs text-gray-300">
              Monitore os tópicos mais buscados no YouTube, TikTok e Google para surfar ondas virais
            </p>
          </div>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <form
        onSubmit={handleSearch}
        className="glass-card rounded-2xl p-4 border border-white/10 flex flex-col md:flex-row gap-4 items-center justify-between"
      >
        <div className="flex-1 flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 w-full focus-within:border-amber-500/50 transition">
          <Search size={18} className="text-gray-400" />
          <input
            type="text"
            value={tema}
            onChange={(e) => setTema(e.target.value)}
            placeholder="Digite um nicho ou palavra-chave (ex: GTA 6, Curiosidades, Fatos Históricos)..."
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

          <ModernButton type="submit" variant="primary" size="md" className="w-full md:w-auto">
            {loading ? <Sparkles size={18} className="animate-spin" /> : <Search size={18} />}
            Buscar Tendências
          </ModernButton>
        </div>
      </form>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {trends.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.1 }}
            className="glass-card rounded-2xl p-6 border border-white/10 hover:border-amber-500/40 transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-1 text-[10px] font-extrabold rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  {item.badge}
                </span>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-emerald-400 font-bold">{item.growth}</span>
                  <div className="flex items-center gap-1 font-bold text-cyan-400">
                    <TrendingUp size={14} />
                    <span>Score: {item.viralityScore}</span>
                  </div>
                </div>
              </div>

              <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition line-clamp-2">
                {item.title}
              </h3>

              <div className="mt-3 text-xs text-gray-400 flex items-center justify-between">
                <span>Fonte: <strong>{item.source}</strong></span>
                <span>{(item.views / 1000).toFixed(0)}k views estimadas</span>
              </div>
            </div>

            <div className="pt-5 border-t border-white/10 mt-5 flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-400">{item.category}</span>

              <div className="flex items-center gap-2">
                <Link href="/create-videos">
                  <ModernButton variant="primary" size="sm">
                    <Zap size={14} /> + Criar Vídeo
                  </ModernButton>
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
