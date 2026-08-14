"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { PlayCircle, Cpu, CheckCircle2, RotateCcw, Pause, Sparkles } from "lucide-react";
import { ModernButton } from "@/components/ui/modern/Button";

export default function ModernRenderQueuePage() {
  const [jobs, setJobs] = useState([
    {
      id: "job_101",
      title: "GTA 6 Vazamentos do Mapa e Personagens",
      project: "GTA 6 Vazações",
      progress: 65,
      status: "processing",
      eta: "1 min restante",
    },
    {
      id: "job_102",
      title: "História Secreta do Hit Livin on a Prayer",
      project: "Bon Jovi História",
      progress: 0,
      status: "pending",
      eta: "Aguardando worker",
    },
    {
      id: "job_103",
      title: "Top 5 Golaços de Kane no Bayern",
      project: "Bayern de Munique",
      progress: 100,
      status: "completed",
      eta: "Renderização Concluída",
    },
  ]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white flex items-center gap-3">
            <PlayCircle className="text-emerald-400" /> Fila de Renderização na Nuvem
          </h1>
          <p className="text-xs text-gray-300">Acompanhamento dos workers do BullMQ em tempo real</p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 text-xs font-bold rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-2">
            <Cpu size={16} /> 2 Workers Ativos
          </span>
        </div>
      </div>

      {/* Jobs List */}
      <div className="space-y-4">
        {jobs.map((job) => (
          <motion.div
            key={job.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card rounded-2xl p-6 border border-white/10 hover:border-emerald-500/30 transition flex flex-col md:flex-row md:items-center justify-between gap-6"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <span
                  className={`px-2.5 py-0.5 text-[10px] font-extrabold rounded-full border ${
                    job.status === "completed"
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      : job.status === "processing"
                      ? "bg-amber-500/10 text-amber-400 border-amber-500/20 animate-pulse"
                      : "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
                  }`}
                >
                  {job.status.toUpperCase()}
                </span>
                <span className="text-xs font-semibold text-gray-400">{job.project}</span>
              </div>

              <h3 className="text-base font-bold text-white truncate">{job.title}</h3>
              <p className="text-xs text-gray-400 mt-1">{job.eta}</p>

              {/* Animated Progress Bar */}
              <div className="w-full bg-white/10 rounded-full h-2 mt-4 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${job.progress}%` }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 rounded-full"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              {job.status === "completed" ? (
                <ModernButton variant="success" size="sm">
                  <CheckCircle2 size={16} /> Ver Vídeo
                </ModernButton>
              ) : (
                <ModernButton variant="secondary" size="sm">
                  <RotateCcw size={14} /> Reenviar
                </ModernButton>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
