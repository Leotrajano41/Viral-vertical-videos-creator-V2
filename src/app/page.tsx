"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Film,
  PlayCircle,
  FolderKanban,
  CheckCircle2,
  Plus,
  Flame,
  ArrowUpRight,
  Clock,
  Sparkles,
  Youtube,
} from "lucide-react";
import { StatCard } from "@/components/ui/modern/StatCard";
import { ModernButton } from "@/components/ui/modern/Button";
import Link from "next/link";

export default function ModernDashboardPage() {
  const [stats, setStats] = useState({
    completedVideos: 142,
    queueCount: 12,
    activeProjects: 8,
    errorCount: 0,
    creditsRemaining: 42,
  });

  const [recentVideos, setRecentVideos] = useState([
    { id: "vid_1", title: "GTA 6 Vazamentos Inéditos da Cidade", project: "GTA 6", status: "rendered", time: "Há 10 min" },
    { id: "vid_2", title: "Curiosidades sobre Bon Jovi na Turnê 90", project: "Bon Jovi", status: "rendering", time: "Há 25 min" },
    { id: "vid_3", title: "5 Jogadas Inacreditáveis do Bayern", project: "Bayern Munich", status: "rendered", time: "Há 1 hora" },
    { id: "vid_4", title: "Novas Notícias da Inteligência Artificial 2026", project: "Tech Trends", status: "scheduled", time: "Há 3 horas" },
  ]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Hero Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="glass-card rounded-3xl p-8 border border-white/10 relative overflow-hidden bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-cyan-900/20"
      >
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-3">
              <Sparkles size={14} /> SaaS Automação Viral v2.0
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              Olá, Criador! 👋
            </h1>
            <p className="text-sm text-gray-300 mt-2 max-w-xl">
              Sua esteira de renderização está ativa. Crie novos vídeos verticais virais e acompanhe o desempenho em lote.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/discovery">
              <ModernButton variant="secondary" size="md">
                <Flame size={16} className="text-amber-400" />
                Buscar Trends
              </ModernButton>
            </Link>
            <Link href="/projects">
              <ModernButton variant="primary" size="md">
                <Plus size={18} />
                + Novo Projeto
              </ModernButton>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* 6 Stat Cards Grid (Desktop 1:1 Clone) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard
          title="Concluídos"
          value={stats.completedVideos}
          subtext="Total criados"
          icon={CheckCircle2}
          color="emerald"
        />
        <StatCard
          title="Gerados Hoje"
          value="18"
          subtext="Últimas 24h"
          icon={Sparkles}
          color="indigo"
        />
        <StatCard
          title="Em Produção"
          value="2"
          subtext="Renderizando"
          icon={PlayCircle}
          color="cyan"
        />
        <StatCard
          title="Na Fila"
          value={stats.queueCount}
          subtext="Aguardando"
          icon={Clock}
          color="amber"
        />
        <StatCard
          title="Com Erro"
          value={stats.errorCount}
          subtext="0 falhas"
          icon={Film}
          color="rose"
        />
        <StatCard
          title="Projetos"
          value={stats.activeProjects}
          subtext="Canais ativos"
          icon={FolderKanban}
          color="indigo"
        />
      </div>

      {/* System Status Banner (Desktop 1:1 Feature) */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card rounded-2xl p-4 border border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs"
      >
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-bold text-white uppercase tracking-wider text-[11px]">Sistema Online</span>
        </div>

        <div className="flex items-center gap-6 flex-wrap">
          <div className="flex items-center gap-2 text-gray-300">
            <span className="text-gray-400">CPU:</span>
            <span className="font-mono font-bold text-cyan-400">8 Cores</span>
          </div>

          <div className="flex items-center gap-2 text-gray-300">
            <span className="text-gray-400">RAM:</span>
            <span className="font-mono font-bold text-white">4.2 GB / 16 GB</span>
          </div>

          <div className="flex items-center gap-2 text-gray-300">
            <span className="text-gray-400">Disco:</span>
            <span className="font-mono font-bold text-white">128 GB Livres</span>
          </div>

          <div className="flex items-center gap-2 text-gray-300">
            <span className="text-gray-400">FFmpeg:</span>
            <span className="font-bold text-emerald-400 flex items-center gap-1">
              <CheckCircle2 size={12} /> Hardware Accel OK
            </span>
          </div>

          <div className="flex items-center gap-2 text-gray-300">
            <span className="text-gray-400">Renders Paralelos:</span>
            <span className="font-mono font-bold text-purple-400">2 / 4 Ativos</span>
          </div>
        </div>
      </motion.div>

      {/* Performance Bar Overview & Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Render Performance Visual Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="lg:col-span-2 glass-card rounded-2xl p-6 border border-white/10 flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Film size={20} className="text-indigo-400" /> Desempenho de Produção Diária
              </h2>
              <p className="text-xs text-gray-400">Vídeos renderizados nos últimos 7 dias</p>
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              High Capacity
            </span>
          </div>

          <div className="h-56 flex items-end gap-4 pt-6 pb-2 justify-between border-b border-white/10">
            {[
              { day: "Seg", val: 40 },
              { day: "Ter", val: 65 },
              { day: "Qua", val: 45 },
              { day: "Qui", val: 85 },
              { day: "Sex", val: 110 },
              { day: "Sáb", val: 135 },
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

          <div className="flex items-center justify-between pt-4 text-xs text-gray-400">
            <span>Média: 91 vídeos/dia</span>
            <span className="text-indigo-400 font-semibold cursor-pointer hover:underline">Ver relatório detalhado →</span>
          </div>
        </motion.div>

        {/* Recent Videos Activity Timeline */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="glass-card rounded-2xl p-6 border border-white/10 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Clock size={18} className="text-cyan-400" /> Atividades Recentes
              </h2>
              <Link href="/render-queue" className="text-xs font-semibold text-cyan-400 hover:underline">
                Ver Fila
              </Link>
            </div>

            <div className="space-y-3">
              {recentVideos.map((vid) => (
                <div
                  key={vid.id}
                  className="p-3 rounded-xl bg-white/5 border border-white/5 hover:border-indigo-500/30 transition flex items-center justify-between group"
                >
                  <div className="min-w-0 flex-1 pr-2">
                    <p className="text-xs font-bold text-white truncate group-hover:text-indigo-300 transition">
                      {vid.title}
                    </p>
                    <span className="text-[10px] text-gray-400">{vid.project} • {vid.time}</span>
                  </div>
                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${
                      vid.status === "rendered"
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        : vid.status === "rendering"
                        ? "bg-amber-500/10 text-amber-400 border-amber-500/20 animate-pulse"
                        : "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
                    }`}
                  >
                    {vid.status.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 mt-4">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-400">YouTube OAuth Connected</span>
              <Youtube size={18} className="text-red-500" />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
