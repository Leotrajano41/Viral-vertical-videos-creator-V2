"use client";

import React, { useState, useEffect } from "react";
import { PlayCircle, PauseCircle, RefreshCw, CheckCircle2, AlertTriangle, Clock } from "lucide-react";

export default function RenderQueuePage() {
  const [filter, setFilter] = useState("all");
  const [jobs, setJobs] = useState([
    {
      id: "job_104",
      title: "3 Fatos Inacreditáveis sobre GTA 6",
      project: "GTA 6 Curiosidades",
      status: "rendering",
      progress: 80,
      eta: "12s",
    },
    {
      id: "job_105",
      title: "MISTÉRIO DO NOVO CONSOLE REVELADO",
      project: "Notícias Tech",
      status: "draft",
      progress: 0,
      eta: "Pendente",
    },
    {
      id: "job_103",
      title: "Segredos Ocultos da Física Quântica",
      project: "Ciência Suprema",
      status: "rendered",
      progress: 100,
      eta: "Concluído",
    },
  ]);

  async function handleRetry(jobId: string) {
    try {
      const res = await fetch("/api/render/retry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoId: jobId }),
      });
      if (res.ok) {
        setJobs((prev) =>
          prev.map((j) => (j.id === jobId ? { ...j, status: "rendering", progress: 10 } : j))
        );
      }
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <PlayCircle className="text-emerald-400" />
            Fila de Renderização na Nuvem (BullMQ Workers)
          </h1>
          <p className="text-xs text-gray-400">Monitoramento em tempo real do processamento paralelos de vídeos</p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 bg-surface border border-border rounded-lg text-sm text-white focus:outline-none"
          >
            <option value="all">Todos os Status</option>
            <option value="rendering">Em Produção</option>
            <option value="rendered">Concluídos</option>
            <option value="error">Com Erro</option>
          </select>

          <button className="flex items-center gap-1.5 px-3 py-2 bg-amber-600/10 hover:bg-amber-600/20 text-amber-400 border border-amber-500/20 rounded-lg text-xs font-semibold transition">
            <PauseCircle size={16} />
            Pausar Fila
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {jobs.map((job) => (
          <div key={job.id} className="bg-surface border border-border p-4 rounded-xl flex items-center justify-between gap-4">
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 font-medium">Projeto: {job.project}</span>
                <span className="text-xs text-gray-500">• Job ID: #{job.id}</span>
              </div>
              <h3 className="text-sm font-semibold text-white">{job.title}</h3>

              {job.status === "rendering" && (
                <div className="flex items-center gap-3 pt-1">
                  <div className="w-48 bg-gray-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-400 h-full transition-all duration-300" style={{ width: `${job.progress}%` }}></div>
                  </div>
                  <span className="text-xs font-mono text-emerald-400">{job.progress}%</span>
                  <span className="text-xs text-gray-400 font-mono">ETA: {job.eta}</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              {job.status === "rendered" && (
                <span className="flex items-center gap-1 px-2.5 py-1 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20 text-xs font-medium">
                  <CheckCircle2 size={14} /> Concluído
                </span>
              )}

              {job.status === "draft" && (
                <span className="flex items-center gap-1 px-2.5 py-1 bg-amber-500/10 text-amber-400 rounded-full border border-amber-500/20 text-xs font-medium">
                  <Clock size={14} /> Na Fila
                </span>
              )}

              {job.status === "error" && (
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 px-2.5 py-1 bg-rose-500/10 text-rose-400 rounded-full border border-rose-500/20 text-xs font-medium">
                    <AlertTriangle size={14} /> Erro
                  </span>
                  <button
                    onClick={() => handleRetry(job.id)}
                    className="flex items-center gap-1 px-2.5 py-1 bg-background hover:bg-border text-gray-200 border border-border rounded-lg text-xs font-medium transition"
                  >
                    <RefreshCw size={14} /> Retentar
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
