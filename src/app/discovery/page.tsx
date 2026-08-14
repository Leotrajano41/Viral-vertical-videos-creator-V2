"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Flame, Search, Globe, Plus, Sparkles, Filter, TrendingUp } from "lucide-react";
import { ModernButton } from "@/components/ui/modern/Button";

export default function ModernDiscoveryPage() {
  const [tema, setTema] = useState("GTA 6");
  const [loading, setLoading] = useState(false);
  const [trends, setTrends] = useState([
    {
      id: "1",
      title: "Vazamento Inédito do Mapa de GTA 6 Vice City",
      source: "YouTube Search",
      viralityScore: 98.4,
      views: 450000,
      badge: "ULTRA VIRAL",
    },
    {
      id: "2",
      title: "Anúncio Surpresa da RockStar Games para 2026",
      source: "Google News",
      viralityScore: 92.1,
      views: 280000,
      badge: "EM ALTA",
    },
    {
      id: "3",
      title: "Comparativo Gráfico GTA 5 vs GTA 6 no PS5 Pro",
      source: "Web Trending",
      viralityScore: 88.7,
      views: 195000,
      badge: "RECOMENDADO",
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
      <div className="glass-card rounded-3xl p-8 border border-white/10 relative overflow-hidden bg-gradient-to-r from-amber-900/30 via-purple-900/20 to-indigo-900/30">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Flame size={24} />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white">
              Descubra Tendências em Tempo Real
            </h1>
            <p className="text-xs text-gray-300">Seus próximos vídeos virais já estão em alta na internet</p>
          </div>
        </div>
      </div>

      {/* Modern Search & Filter Controls */}
      <form onSubmit={handleSearch} className="glass-card rounded-2xl p-4 border border-white/10 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex-1 flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 w-full focus-within:border-indigo-500/50 transition">
          <Search size={18} className="text-gray-400" />
          <input
            type="text"
            value={tema}
            onChange={(e) => setTema(e.target.value)}
            placeholder="Digite um tema ou palavra-chave (ex: GTA 6, Inteligência Artificial)..."
            className="bg-transparent text-sm text-white placeholder-gray-400 focus:outline-none w-full font-medium"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select className="bg-white/5 border border-white/10 text-xs font-semibold text-gray-300 rounded-xl px-3.5 py-3 focus:outline-none cursor-pointer hover:bg-white/10 transition">
            <option value="BR">🇧🇷 Brasil (BR)</option>
            <option value="US">🇺🇸 Estados Unidos (US)</option>
          </select>

          <ModernButton type="submit" variant="primary" size="md" className="w-full md:w-auto">
            {loading ? <Sparkles size={18} className="animate-spin" /> : <Search size={18} />}
            Buscar Trends
          </ModernButton>
        </div>
      </form>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {trends.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.1 }}
            className="glass-card rounded-2xl p-6 border border-white/10 hover:border-indigo-500/40 transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-1 text-[10px] font-extrabold rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  {item.badge}
                </span>
                <div className="flex items-center gap-1 text-xs font-bold text-cyan-400">
                  <TrendingUp size={14} />
                  <span>Score: {item.viralityScore}</span>
                </div>
              </div>

              <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition line-clamp-2">
                {item.title}
              </h3>
              <p className="text-xs text-gray-400 mt-2">Fonte: {item.source} • {(item.views / 1000).toFixed(0)}k views</p>
            </div>

            <div className="pt-5 border-t border-white/10 mt-5 flex items-center justify-between">
              <span className="text-xs font-medium text-emerald-400">Pronto para conversão</span>
              <ModernButton variant="primary" size="sm">
                <Plus size={14} /> + Projeto
              </ModernButton>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
