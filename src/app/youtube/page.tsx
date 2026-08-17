"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Youtube,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Play,
  Sparkles,
  Settings,
  Shield,
  ArrowUpRight,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { ModernButton } from "@/components/ui/modern/Button";

export default function YouTubePage() {
  const [account, setAccount] = useState({
    connected: true,
    channelTitle: "Canal Viral Shorts BR",
    channelId: "UC_viral_shorts_official_2026",
    subscribers: "128.4K",
    quotaUsed: 1600,
    quotaTotal: 10000,
  });

  const [scheduleConfig, setScheduleConfig] = useState({
    videosPerDay: 2,
    startHour: 9,
    endHour: 21,
  });

  const [scheduling, setScheduling] = useState(false);
  const [scheduleMessage, setScheduleMessage] = useState("");

  const [scheduledVideos, setScheduledVideos] = useState([
    {
      id: "yt_1",
      title: "GTA 6: O Segredo Oculto de Vice City Revelado em Documentos",
      project: "GTA 6 Vazações",
      scheduledAt: "17/08/2026 às 18:00",
      status: "scheduled",
    },
    {
      id: "yt_2",
      title: "Como Livin on a Prayer quase foi descartada por Bon Jovi",
      project: "Bon Jovi História",
      scheduledAt: "18/08/2026 às 09:00",
      status: "scheduled",
    },
    {
      id: "yt_3",
      title: "5 Golaços Absurdos de Harry Kane que Chocaram a Alemanha",
      project: "Bayern de Munique",
      scheduledAt: "18/08/2026 às 18:00",
      status: "scheduled",
    },
    {
      id: "yt_4",
      title: "Nova Inteligência Artificial que Roda Local sem GPU",
      project: "Tech Trends",
      scheduledAt: "19/08/2026 às 09:00",
      status: "scheduled",
    },
  ]);

  const handleBatchSchedule = () => {
    setScheduling(true);
    setScheduleMessage("");
    setTimeout(() => {
      setScheduling(false);
      setScheduleMessage("✅ 4 vídeos distribuídos com sucesso no YouTube Shorts respeitando a janela segura das 06h às 22h!");
      setTimeout(() => setScheduleMessage(""), 5000);
    }, 1500);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="glass-card rounded-3xl p-8 border border-white/10 relative overflow-hidden bg-gradient-to-r from-red-950/50 via-purple-900/30 to-indigo-900/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-red-600/20 text-red-500 border border-red-500/30">
              <Youtube size={32} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white">
                Distribuição Automática no YouTube
              </h1>
              <p className="text-xs text-gray-300">
                Conecte seu canal, agende vídeos em lote e gerencie uploads diários com proteção anti-spam
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {account.connected ? (
              <span className="px-3.5 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 size={16} /> Canal Conectado
              </span>
            ) : (
              <ModernButton variant="primary" size="md">
                <Youtube size={16} /> Conectar Canal
              </ModernButton>
            )}
          </div>
        </div>
      </div>

      {/* Account Info & Quota Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Channel Card */}
        <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400">Canal Conectado</h2>
            <Youtube size={20} className="text-red-500" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{account.channelTitle}</h3>
            <p className="text-xs text-gray-400 font-mono mt-0.5">{account.channelId}</p>
          </div>
          <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
            <span className="text-gray-400">Inscritos:</span>
            <span className="font-bold text-white">{account.subscribers}</span>
          </div>
        </div>

        {/* API Quota Card */}
        <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400">Cota Diária da API</h2>
            <Shield size={20} className="text-cyan-400" />
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-extrabold text-white">{account.quotaUsed}</h3>
              <span className="text-xs text-gray-400">/ {account.quotaTotal} unidades</span>
            </div>
            <p className="text-[11px] text-emerald-400 mt-1">Cota saudável • ~5 uploads restantes hoje</p>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full"
              style={{ width: `${(account.quotaUsed / account.quotaTotal) * 100}%` }}
            />
          </div>
        </div>

        {/* Safe Window Rule Card */}
        <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-3">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold">
            <Clock size={16} /> Janela Segura de Publicação
          </div>
          <p className="text-xs text-gray-300 leading-relaxed">
            Shorts são agendados automaticamente apenas entre <strong className="text-white">06:00</strong> e <strong className="text-white">22:00</strong> para máxima retenção de público e proteção do algoritmo.
          </p>
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300 font-semibold">
            🛡️ Publicações na madrugada são adiadas para as 06:00
          </div>
        </div>
      </div>

      {/* YouTube Cookies Anti-Bot Banner (Original Tool Feature) */}
      <div className="glass-card rounded-2xl p-6 border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-red-950/20 to-transparent">
        <div className="space-y-1">
          <h3 className="text-xs font-bold text-white flex items-center gap-2">
            <Shield size={16} className="text-emerald-400" /> Cookies do YouTube (Contorna &quot;Sign in to confirm you&apos;re not a bot&quot;)
          </h3>
          <p className="text-[11px] text-gray-400 leading-relaxed max-w-2xl">
            Quando o YouTube bloqueia downloads ou transcrições de vídeos, o app utiliza automaticamente a sessão do seu navegador ou o arquivo <code className="text-cyan-400 font-mono">cookies.txt</code> para contornar qualquer verificação.
          </p>
        </div>

        <a
          href="/settings"
          className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-gray-300 hover:text-white transition whitespace-nowrap text-center"
        >
          ⚙️ Ajustar Cookies em Configurações →
        </a>
      </div>

      {/* Batch Scheduling Panel */}
      <div className="glass-card rounded-2xl p-8 border border-white/10 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles size={20} className="text-indigo-400" /> Agendador Inteligente em Lote (Smart Batch Scheduler)
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Distribui automaticamente todos os vídeos prontos ao longo dos próximos dias
            </p>
          </div>

          <ModernButton
            variant="primary"
            size="md"
            onClick={handleBatchSchedule}
            disabled={scheduling}
          >
            {scheduling ? <Loader2 size={16} className="animate-spin" /> : <Calendar size={16} />}
            Distribuir 4 Vídeos em Lote
          </ModernButton>
        </div>

        {/* Configuration Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-2">
              Vídeos por Dia ({scheduleConfig.videosPerDay} vídeos/dia)
            </label>
            <input
              type="range"
              min="1"
              max="5"
              step="1"
              value={scheduleConfig.videosPerDay}
              onChange={(e) => setScheduleConfig({ ...scheduleConfig, videosPerDay: parseInt(e.target.value) })}
              className="w-full accent-indigo-500"
            />
            <div className="flex justify-between text-[10px] text-gray-400 mt-1">
              <span>1/dia</span>
              <span>2/dia</span>
              <span>3/dia</span>
              <span>4/dia</span>
              <span>5/dia</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-2">Horário do 1º Vídeo</label>
            <select
              value={scheduleConfig.startHour}
              onChange={(e) => setScheduleConfig({ ...scheduleConfig, startHour: parseInt(e.target.value) })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
            >
              <option value="9">09:00 (Manhã)</option>
              <option value="12">12:00 (Almoço)</option>
              <option value="15">15:00 (Tarde)</option>
              <option value="18">18:00 (Pico Noturno)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-2">Tipo de Privacidade</label>
            <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none">
              <option value="public">🌐 Público Imediato no Horário</option>
              <option value="unlisted">🔒 Não Listado</option>
              <option value="private">👁️ Privado</option>
            </select>
          </div>
        </div>

        {scheduleMessage && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-400 font-semibold flex items-center gap-2"
          >
            <CheckCircle2 size={16} />
            {scheduleMessage}
          </motion.div>
        )}
      </div>

      {/* Scheduled Videos Timeline */}
      <div className="glass-card rounded-2xl p-8 border border-white/10 space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Calendar size={18} className="text-cyan-400" /> Próximas Publicações no Canal
        </h2>

        <div className="space-y-3">
          {scheduledVideos.map((vid) => (
            <div
              key={vid.id}
              className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-red-500/30 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-red-600/10 text-red-400 border border-red-500/20">
                  <Youtube size={20} />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white">{vid.title}</h3>
                  <span className="text-[11px] text-gray-400">{vid.project}</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-xs font-semibold text-cyan-400 flex items-center gap-1.5 font-mono">
                  <Clock size={14} /> {vid.scheduledAt}
                </span>
                <span className="px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[10px] font-extrabold uppercase">
                  Agendado
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
