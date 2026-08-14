"use client";

import React from "react";
import { motion } from "framer-motion";
import { BarChart3, Eye, ThumbsUp, MessageSquare, TrendingUp, Award } from "lucide-react";
import { StatCard } from "@/components/ui/modern/StatCard";

export default function ModernAnalyticsPage() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white flex items-center gap-3">
          <BarChart3 className="text-indigo-400" /> Analytics & Desempenho dos Canais
        </h1>
        <p className="text-xs text-gray-300">Métricas pós-publicação de engajamento e alcance de vídeos verticais</p>
      </div>

      {/* Top 4 Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Visualizações Totais"
          value="1.420.000"
          subtext="Alcance em Shorts & Reels"
          icon={Eye}
          color="indigo"
          trend="+24% este mês"
        />
        <StatCard
          title="Curtidas / Likes"
          value="98.500"
          subtext="Interações de fãs"
          icon={ThumbsUp}
          color="emerald"
        />
        <StatCard
          title="Comentários"
          value="14.200"
          subtext="Engajamento ativo"
          icon={MessageSquare}
          color="amber"
        />
        <StatCard
          title="Taxa de Engajamento"
          value="8.4%"
          subtext="Acima da média de mercado"
          icon={TrendingUp}
          color="cyan"
          trend="Excelente"
        />
      </div>

      {/* 7-Day Performance Chart */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="glass-card rounded-2xl p-6 border border-white/10 space-y-4"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-white">Desempenho de Alcance dos Últimos 7 Dias</h2>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            Top Performing
          </span>
        </div>

        <div className="h-56 flex items-end gap-4 pt-8 justify-between border-b border-white/10 pb-4">
          {[
            { day: "Seg", val: 65 },
            { day: "Ter", val: 80 },
            { day: "Qua", val: 45 },
            { day: "Qui", val: 95 },
            { day: "Sex", val: 110 },
            { day: "Sáb", val: 140 },
            { day: "Dom", val: 160 },
          ].map((bar) => (
            <div key={bar.day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
              <div
                className="w-full bg-gradient-to-t from-indigo-600 via-purple-500 to-cyan-400 rounded-t-lg transition-all duration-300 group-hover:brightness-125 group-hover:glow-primary"
                style={{ height: `${(bar.val / 160) * 100}%` }}
              />
              <span className="text-xs text-gray-400 font-mono group-hover:text-white transition">{bar.day}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
