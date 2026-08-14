"use client";

import React, { useState } from "react";
import { FolderPlus, Settings2, Copy, Trash2, Sparkles } from "lucide-react";

export default function ProjectsPage() {
  const [projects] = useState([
    {
      id: "proj_1",
      name: "GTA 6 Curiosidades",
      niche: "Games / Tecnologia",
      mainTopic: "GTA 6 Vazamentos",
      voice: "Edge TTS (Antônio Neural)",
      duration: "35s",
    },
    {
      id: "proj_2",
      name: "Segredos da Ciência",
      niche: "Curiosidades / Ciência",
      mainTopic: "Física & Espaço",
      voice: "XTTS (Voz Clonada)",
      duration: "40s",
    },
  ]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Meus Projetos Web</h1>
          <p className="text-xs text-gray-400">Gerencie múltiplos canais e presets de automação</p>
        </div>

        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition">
          <FolderPlus size={16} />
          + Criar Novo Projeto
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map((proj) => (
          <div key={proj.id} className="bg-surface border border-border p-5 rounded-xl space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-md">
                  {proj.niche}
                </span>
                <h3 className="text-base font-bold text-white mt-2">{proj.name}</h3>
                <p className="text-xs text-gray-400 mt-0.5">Tema: {proj.mainTopic}</p>
              </div>

              <div className="flex items-center gap-1">
                <button title="Clonar Projeto" className="p-2 text-gray-400 hover:text-white bg-background border border-border rounded-lg">
                  <Copy size={15} />
                </button>
                <button title="Configurações" className="p-2 text-gray-400 hover:text-white bg-background border border-border rounded-lg">
                  <Settings2 size={15} />
                </button>
              </div>
            </div>

            <div className="pt-3 border-t border-border flex items-center justify-between text-xs text-gray-400">
              <span>Voz: {proj.voice}</span>
              <span>Duração: {proj.duration}</span>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition">
                <Sparkles size={15} />
                Gerar 10 Ideias com IA
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
