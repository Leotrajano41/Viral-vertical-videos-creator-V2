"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  History,
  Search,
  Play,
  Download,
  Share2,
  Youtube,
  Copy,
  Trash2,
  CheckCircle2,
  Calendar,
  Clock,
  Sparkles,
  ExternalLink,
  X,
  FileText,
} from "lucide-react";
import { ModernButton } from "@/components/ui/modern/Button";

interface VideoItem {
  id: string;
  title: string;
  project: string;
  duration: string;
  createdAt: string;
  status: "rendered" | "scheduled" | "published";
  scheduledFor?: string;
  views?: number;
  thumbnailUrl: string;
  description: string;
  tags: string[];
  scriptText: string;
}

export default function HistoryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProject, setSelectedProject] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [activePreview, setActivePreview] = useState<VideoItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [videos, setVideos] = useState<VideoItem[]>([
    {
      id: "vid_101",
      title: "GTA 6: O Segredo Oculto de Vice City Revelado em Documentos",
      project: "GTA 6 Vazações",
      duration: "0:34",
      createdAt: "17/08/2026 10:20",
      status: "published",
      views: 14200,
      thumbnailUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&auto=format&fit=crop&q=60",
      description: "Você não vai acreditar no que a Rockstar planejou para o novo GTA 6! #shorts #gta6 #games",
      tags: ["gta6", "rockstargames", "vicecity", "games", "shorts"],
      scriptText: "Você sabia que o mapa de GTA 6 é 3 vezes maior do que o de GTA 5? Documentos internos vazados revelam mais de 5 cidades jogáveis e um sistema climático ultra dinâmico. Inscreva-se para não perder o lançamento oficial!",
    },
    {
      id: "vid_102",
      title: "Como Livin on a Prayer quase foi descartada por Bon Jovi",
      project: "Bon Jovi História",
      duration: "0:38",
      createdAt: "17/08/2026 09:45",
      status: "scheduled",
      scheduledFor: "17/08/2026 às 18:00",
      thumbnailUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=60",
      description: "A história inacreditável de como um dos maiores hits do rock quase não existiu! #bonjovi #rock #curiosidades",
      tags: ["bonjovi", "rock", "musica", "curiosidades", "anos80"],
      scriptText: "Jon Bon Jovi quase jogou no lixo a música que mudou sua vida para sempre. Descubra os bastidores da gravação de Livin on a Prayer em 1986!",
    },
    {
      id: "vid_103",
      title: "5 Golaços Absurdos de Harry Kane que Chocaram a Alemanha",
      project: "Bayern de Munique",
      duration: "0:29",
      createdAt: "16/08/2026 21:15",
      status: "rendered",
      thumbnailUrl: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=500&auto=format&fit=crop&q=60",
      description: "Os gols mais inacreditáveis de Kane no Bayern de Munique! #futebol #bayern #shorts",
      tags: ["futebol", "bayern", "kane", "gols", "championsleague"],
      scriptText: "Harry Kane quebrou todos os recordes da Bundesliga em tempo recorde! Veja os 5 gols mais espetaculares da temporada.",
    },
    {
      id: "vid_104",
      title: "Nova Inteligência Artificial que Roda Local sem GPU",
      project: "Tech Trends",
      duration: "0:42",
      createdAt: "16/08/2026 17:30",
      status: "published",
      views: 28400,
      thumbnailUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=60",
      description: "O avanço mais impressionante da IA em 2026! #tecnologia #ia #shorts",
      tags: ["ia", "inteligenciaartificial", "tech", "futuro", "inovacao"],
      scriptText: "Pesquisadores conseguiram rodar modelos de 70 bilhões de parâmetros direto na CPU de qualquer computador comum!",
    },
  ]);

  const handleCopyScript = (vid: VideoItem) => {
    navigator.clipboard.writeText(vid.scriptText);
    setCopiedId(vid.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const filteredVideos = videos.filter((v) => {
    const matchesSearch = v.title.toLowerCase().includes(searchTerm.toLowerCase()) || v.project.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProject = selectedProject === "all" || v.project === selectedProject;
    const matchesStatus = selectedStatus === "all" || v.status === selectedStatus;
    return matchesSearch && matchesProject && matchesStatus;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="glass-card rounded-3xl p-8 border border-white/10 relative overflow-hidden bg-gradient-to-r from-rose-900/40 via-purple-900/30 to-indigo-900/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
              <History size={28} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white">
                Histórico de Vídeos Criados
              </h1>
              <p className="text-xs text-gray-300">
                142 vídeos verticais renderizados e prontos para download e distribuição
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-white">
              Total: {videos.length} vídeos listados
            </span>
          </div>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="glass-card rounded-2xl p-4 border border-white/10 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex-1 flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 w-full focus-within:border-rose-500/50 transition">
          <Search size={18} className="text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por título ou nome do projeto..."
            className="bg-transparent text-sm text-white placeholder-gray-400 focus:outline-none w-full font-medium"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-white/5 border border-white/10 text-xs font-semibold text-gray-300 rounded-xl px-3.5 py-3 focus:outline-none cursor-pointer"
          >
            <option value="all">Todos os Status</option>
            <option value="rendered">✅ Prontos (Rendered)</option>
            <option value="scheduled">📅 Agendados</option>
            <option value="published">🚀 Publicados</option>
          </select>

          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="bg-white/5 border border-white/10 text-xs font-semibold text-gray-300 rounded-xl px-3.5 py-3 focus:outline-none cursor-pointer"
          >
            <option value="all">Todos os Projetos</option>
            <option value="GTA 6 Vazações">GTA 6 Vazações</option>
            <option value="Bon Jovi História">Bon Jovi História</option>
            <option value="Bayern de Munique">Bayern de Munique</option>
            <option value="Tech Trends">Tech Trends</option>
          </select>
        </div>
      </div>

      {/* Videos Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredVideos.map((vid, idx) => (
          <motion.div
            key={vid.id}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25, delay: idx * 0.05 }}
            className="glass-card rounded-2xl overflow-hidden border border-white/10 hover:border-rose-500/40 transition-all flex flex-col justify-between group"
          >
            {/* Thumbnail Header */}
            <div className="relative aspect-[9/12] w-full bg-black/60 overflow-hidden cursor-pointer" onClick={() => setActivePreview(vid)}>
              <img
                src={vid.thumbnailUrl}
                alt={vid.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30" />

              {/* Play Overlay Button */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-12 h-12 rounded-full bg-rose-600/90 text-white flex items-center justify-center shadow-xl transform scale-75 group-hover:scale-100 transition">
                  <Play size={20} fill="white" className="ml-1" />
                </div>
              </div>

              {/* Duration Badge */}
              <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded bg-black/80 text-[10px] font-mono text-white font-bold">
                {vid.duration}
              </span>

              {/* Status Badge */}
              <span
                className={`absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${
                  vid.status === "published"
                    ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                    : vid.status === "scheduled"
                    ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/30"
                    : "bg-purple-500/20 text-purple-300 border-purple-500/30"
                }`}
              >
                {vid.status === "published"
                  ? "✅ PUBLICADO"
                  : vid.status === "scheduled"
                  ? "📅 AGENDADO"
                  : "🎬 PRONTO"}
              </span>
            </div>

            {/* Video Content & Info */}
            <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-semibold text-gray-400">{vid.project}</span>
                <h3 className="text-xs font-bold text-white mt-1 line-clamp-2 leading-snug group-hover:text-rose-300 transition">
                  {vid.title}
                </h3>
              </div>

              {/* Actions Footer */}
              <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-1">
                <button
                  onClick={() => handleCopyScript(vid)}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition"
                  title="Copiar Roteiro"
                >
                  <Copy size={14} />
                </button>

                <button
                  onClick={() => alert(`Baixando vídeo: ${vid.title}.mp4`)}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition"
                  title="Baixar MP4"
                >
                  <Download size={14} />
                </button>

                <button
                  onClick={() => setActivePreview(vid)}
                  className="px-3 py-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 border border-rose-500/30 text-[11px] font-semibold flex items-center gap-1 transition"
                >
                  <Play size={12} fill="currentColor" /> Preview
                </button>
              </div>

              {copiedId === vid.id && (
                <p className="text-[10px] text-emerald-400 text-center font-bold">
                  ✓ Roteiro copiado!
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Video Preview Modal */}
      <AnimatePresence>
        {activePreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="glass-card rounded-3xl max-w-2xl w-full border border-white/20 p-6 relative overflow-hidden space-y-4"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider">
                    {activePreview.project}
                  </span>
                  <h2 className="text-base font-extrabold text-white">{activePreview.title}</h2>
                </div>
                <button
                  onClick={() => setActivePreview(null)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Mock Player */}
              <div className="relative aspect-[9/14] max-h-80 mx-auto rounded-2xl bg-black overflow-hidden flex flex-col justify-between p-4 shadow-2xl border border-white/10">
                <img
                  src={activePreview.thumbnailUrl}
                  alt={activePreview.title}
                  className="absolute inset-0 w-full h-full object-cover opacity-60"
                />
                <div className="relative z-10 py-1 px-2 bg-yellow-400 rounded text-center">
                  <span className="text-[9px] font-black text-black uppercase">
                    {activePreview.title.slice(0, 30)}...
                  </span>
                </div>
                <div className="relative z-10 text-center my-auto">
                  <span className="text-xs font-black text-white bg-black/80 px-2 py-1 rounded">
                    ▶ REPRODUZINDO COM ÁUDIO LUFS -14
                  </span>
                </div>
                <div className="relative z-10 text-center text-[8px] text-gray-400">
                  Duração: {activePreview.duration} • 1080x1920 9:16
                </div>
              </div>

              {/* Roteiro e Detalhes */}
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 text-xs space-y-2">
                <span className="font-bold text-gray-300 flex items-center gap-1.5">
                  <FileText size={14} className="text-cyan-400" /> Roteiro Narrado:
                </span>
                <p className="text-gray-400 leading-relaxed font-mono text-[11px]">
                  {activePreview.scriptText}
                </p>
              </div>

              {/* Footer Modal Actions */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-gray-400">Criado em {activePreview.createdAt}</span>
                <div className="flex items-center gap-2">
                  <ModernButton
                    variant="secondary"
                    size="sm"
                    onClick={() => handleCopyScript(activePreview)}
                  >
                    <Copy size={14} /> Copiar Roteiro
                  </ModernButton>
                  <ModernButton
                    variant="primary"
                    size="sm"
                    onClick={() => alert(`Download iniciado: ${activePreview.title}.mp4`)}
                  >
                    <Download size={14} /> Baixar Vídeo
                  </ModernButton>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
