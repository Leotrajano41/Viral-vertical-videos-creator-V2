import React from "react";
import { Video, Flame, FolderPlus, Clock, CheckCircle2, AlertTriangle } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Metrics Banner */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-surface border border-border p-5 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 font-medium">Vídeos Concluídos</p>
            <h3 className="text-2xl font-bold text-white mt-1">142</h3>
          </div>
          <div className="p-3 bg-emerald-500/10 rounded-lg text-emerald-400">
            <CheckCircle2 size={24} />
          </div>
        </div>

        <div className="bg-surface border border-border p-5 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 font-medium">Em Produção / Fila</p>
            <h3 className="text-2xl font-bold text-white mt-1">12</h3>
          </div>
          <div className="p-3 bg-amber-500/10 rounded-lg text-amber-400">
            <Clock size={24} />
          </div>
        </div>

        <div className="bg-surface border border-border p-5 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 font-medium">Projetos Ativos</p>
            <h3 className="text-2xl font-bold text-white mt-1">8</h3>
          </div>
          <div className="p-3 bg-indigo-500/10 rounded-lg text-indigo-400">
            <Video size={24} />
          </div>
        </div>

        <div className="bg-surface border border-border p-5 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 font-medium">Erros em Rendição</p>
            <h3 className="text-2xl font-bold text-white mt-1">0</h3>
          </div>
          <div className="p-3 bg-rose-500/10 rounded-lg text-rose-400">
            <AlertTriangle size={24} />
          </div>
        </div>
      </div>

      {/* Quick Actions & Recent Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-surface border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-white">Fila de Renderização na Nuvem</h2>
            <span className="text-xs text-emerald-400 font-medium">Renderizando 2x paralelos</span>
          </div>

          <div className="space-y-3">
            <div className="p-4 bg-background/50 border border-border rounded-lg flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">3 Fatos inacreditáveis sobre GTA 6</p>
                <p className="text-xs text-gray-400">Projeto: GTA 6 Curiosidades • Duração: 35s</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-32 bg-gray-700 h-2 rounded-full overflow-hidden">
                  <div className="bg-indigo-500 h-full w-4/5 animate-pulse"></div>
                </div>
                <span className="text-xs text-gray-300 font-mono">80%</span>
              </div>
            </div>

            <div className="p-4 bg-background/50 border border-border rounded-lg flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">MISTÉRIO DO NOVO CONSOLE REVELADO</p>
                <p className="text-xs text-gray-400">Projeto: Notícias Tech • Duração: 28s</p>
              </div>
              <span className="text-xs px-2.5 py-1 bg-amber-500/10 text-amber-400 rounded-full border border-amber-500/20 font-medium">
                Na Fila
              </span>
            </div>
          </div>
        </div>

        <div className="bg-surface border border-border rounded-xl p-6">
          <h2 className="text-base font-semibold text-white mb-4">Ações Rápidas</h2>
          <div className="space-y-3">
            <a href="/discovery" className="w-full flex items-center gap-3 p-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition justify-center">
              <Flame size={18} />
              Buscar Tendências no Google
            </a>
            <a href="/projects" className="w-full flex items-center gap-3 p-3 bg-background hover:bg-border text-gray-200 border border-border rounded-lg text-sm font-medium transition justify-center">
              <FolderPlus size={18} />
              + Novo Projeto Web
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
