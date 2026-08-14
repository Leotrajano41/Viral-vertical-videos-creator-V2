"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { FolderKanban, Plus, Sparkles, Mic, Layers, Play, Copy, Trash2 } from "lucide-react";
import { ModernButton } from "@/components/ui/modern/Button";

export default function ModernProjectsPage() {
  const [projects, setProjects] = useState([
    {
      id: "proj_1",
      name: "GTA 6 Vazações Virais",
      niche: "Games & Vazações",
      theme: "Rockstar Games",
      format: "9:16",
      voiceType: "Edge TTS Antonio",
      ideasCount: 10,
      videosCount: 14,
    },
    {
      id: "proj_2",
      name: "Bon Jovi História do Rock",
      niche: "Música & Rock",
      theme: "Curiosidades Anos 80 e 90",
      format: "9:16",
      voiceType: "Voz Clonada XTTS",
      ideasCount: 8,
      videosCount: 12,
    },
    {
      id: "proj_3",
      name: "Bayern de Munique Shorts",
      niche: "Futebol Europeu",
      theme: "Melhores Momentos e Estatísticas",
      format: "9:16",
      voiceType: "Edge TTS Francisca",
      ideasCount: 15,
      videosCount: 22,
    },
  ]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white flex items-center gap-3">
            <FolderKanban className="text-purple-400" /> Meus Projetos Virais
          </h1>
          <p className="text-xs text-gray-300">Gerencie múltiplos canais e presete suas regras automáticas de geração</p>
        </div>

        <ModernButton variant="primary" size="md">
          <Plus size={18} />
          + Criar Novo Projeto
        </ModernButton>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {projects.map((proj, idx) => (
          <motion.div
            key={proj.id}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: idx * 0.1 }}
            className="glass-card rounded-2xl p-6 border border-white/10 hover:border-purple-500/40 transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-2.5 py-1 text-[10px] font-extrabold rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
                  Formato: {proj.format}
                </span>
                <span className="text-[11px] font-bold text-gray-400 flex items-center gap-1">
                  <Mic size={12} className="text-cyan-400" /> {proj.voiceType}
                </span>
              </div>

              <h3 className="text-lg font-extrabold text-white group-hover:text-purple-300 transition">
                {proj.name}
              </h3>
              <p className="text-xs text-gray-300 mt-1 font-medium">{proj.niche} • {proj.theme}</p>

              <div className="mt-4 pt-4 border-t border-white/5 grid grid-cols-2 gap-2 text-center text-xs">
                <div className="p-2 rounded-xl bg-white/5">
                  <span className="block font-extrabold text-white text-base">{proj.ideasCount}</span>
                  <span className="text-[10px] text-gray-400">Ideias Pendentes</span>
                </div>
                <div className="p-2 rounded-xl bg-white/5">
                  <span className="block font-extrabold text-emerald-400 text-base">{proj.videosCount}</span>
                  <span className="text-[10px] text-gray-400">Vídeos Prontos</span>
                </div>
              </div>
            </div>

            <div className="pt-5 border-t border-white/10 mt-5 flex items-center justify-between gap-2">
              <ModernButton variant="primary" size="sm" className="w-full">
                <Sparkles size={14} /> Gerar 10 Ideias
              </ModernButton>
              <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition">
                <Copy size={16} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
