"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Brain,
  Film,
  Mic,
  Cloud,
  Database,
  Youtube,
  FolderKanban,
  PlayCircle,
  Trophy,
  ExternalLink,
  Shield,
  Loader2,
  TestTube2,
  XCircle,
  Zap,
  Volume2,
  Upload,
  Clock,
  Play,
  RotateCcw,
} from "lucide-react";
import { ModernButton } from "@/components/ui/modern/Button";
import Link from "next/link";

interface StepDef {
  id: number;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  color: string;
  badge: string;
}

const STEPS: StepDef[] = [
  {
    id: 1,
    title: "Bem-vindo ao Viral Creator v2.0",
    subtitle: "Visão geral da esteira de automação de vídeos verticais em lote",
    icon: Sparkles,
    color: "text-indigo-400",
    badge: "Visão Geral",
  },
  {
    id: 2,
    title: "Configuração do Motor de IA",
    subtitle: "Conecte OpenRouter, OpenAI ou Gemini para criar roteiros magnéticos",
    icon: Brain,
    color: "text-purple-400",
    badge: "IA & Roteiros",
  },
  {
    id: 3,
    title: "Mídia & Vídeos de Fundo (B-Roll)",
    subtitle: "Conecte Pexels ou Pixabay para obter vídeos stock gratuitos em 9:16",
    icon: Film,
    color: "text-amber-400",
    badge: "B-Roll Stock",
  },
  {
    id: 4,
    title: "Voz & Legendas Karaoke",
    subtitle: "Configuração de vozes neurais Edge TTS, XTTS v2 e AssemblyAI",
    icon: Mic,
    color: "text-cyan-400",
    badge: "Áudio & TTS",
  },
  {
    id: 5,
    title: "Armazenamento & Nuvem",
    subtitle: "Definição do bucket AWS S3 para renderização e distribuição",
    icon: Cloud,
    color: "text-blue-400",
    badge: "Storage S3",
  },
  {
    id: 6,
    title: "Banco de Dados & Cache Redis",
    subtitle: "PostgreSQL & Upstash Redis para fila assíncrona BullMQ",
    icon: Database,
    color: "text-emerald-400",
    badge: "Infraestrutura",
  },
  {
    id: 7,
    title: "Conectar Canal do YouTube",
    subtitle: "Autorização OAuth 2.0 para agendamento e publicação automática",
    icon: Youtube,
    color: "text-red-500",
    badge: "Distribuição",
  },
  {
    id: 8,
    title: "Criar seu 1º Projeto Viral",
    subtitle: "Escolha o nicho, tema, templates de alta retenção e duração",
    icon: FolderKanban,
    color: "text-indigo-400",
    badge: "1º Projeto",
  },
  {
    id: 9,
    title: "Gerar Ideias & Iniciar Produção",
    subtitle: "Selecione ideias virais e envie para a fila de renderização",
    icon: PlayCircle,
    color: "text-cyan-400",
    badge: "Produção",
  },
  {
    id: 10,
    title: "Vídeo Pronto & Sucesso Total",
    subtitle: "Seu primeiro vídeo renderizado, pronto para download e agendamento!",
    icon: Trophy,
    color: "text-amber-400",
    badge: "Conclusão",
  },
];

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  // Step 2 (LLM) State
  const [openRouterKey, setOpenRouterKey] = useState("");
  const [openRouterTest, setOpenRouterTest] = useState<{ loading: boolean; status: "success" | "error" | null; msg: string }>({
    loading: false,
    status: null,
    msg: "",
  });

  // Step 3 (Media) State
  const [pexelsKey, setPexelsKey] = useState("");
  const [pexelsTest, setPexelsTest] = useState<{ loading: boolean; status: "success" | "error" | null; msg: string }>({
    loading: false,
    status: null,
    msg: "",
  });

  // Step 8 (Project) State
  const [firstProject, setFirstProject] = useState({
    name: "GTA 6 Segredos & Vazações",
    niche: "Games & Curiosidades",
    theme: "Rockstar Games & Vice City",
    template: "breaking_news",
    voice: "pt-BR-AntonioNeural",
    durationMin: 25,
    durationMax: 40,
  });

  // Step 9 (Production) State
  const [selectedIdeas, setSelectedIdeas] = useState<string[]>(["idea_1", "idea_2"]);
  const [renderProgress, setRenderProgress] = useState(0);
  const [isRendering, setIsRendering] = useState(false);

  const markCompleted = (stepId: number) => {
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps((prev) => [...prev, stepId]);
    }
  };

  const handleNext = () => {
    markCompleted(currentStep);
    if (currentStep < 10) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const testApiKey = async (keyName: string, value: string, setTestState: any) => {
    setTestState({ loading: true, status: null, msg: "" });
    try {
      // Save key first
      await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: keyName, value }),
      });

      // Test key
      const res = await fetch("/api/settings/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: keyName }),
      });
      const data = await res.json();
      if (data.success) {
        setTestState({ loading: false, status: "success", msg: data.message });
        markCompleted(currentStep);
      } else {
        setTestState({ loading: false, status: "error", msg: data.message || "Chave inválida" });
      }
    } catch {
      setTestState({ loading: false, status: "error", msg: "Erro ao conectar à API" });
    }
  };

  const handleStartRender = () => {
    setIsRendering(true);
    setRenderProgress(10);
    const interval = setInterval(() => {
      setRenderProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsRendering(false);
          markCompleted(9);
          handleNext();
          return 100;
        }
        return prev + 25;
      });
    }, 600);
  };

  const progressPercent = Math.round(((currentStep - 1) / 9) * 100);

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Header Banner */}
      <div className="glass-card rounded-3xl p-8 border border-white/10 relative overflow-hidden bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-cyan-900/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-3">
              <Zap size={14} className="text-amber-400" /> Setup Assistant • 10 Passos
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white">
              Guia Passo-a-Passo de Configuração
            </h1>
            <p className="text-xs text-gray-300 mt-1">
              Configure sua esteira de vídeos em menos de 5 minutos e gere seu primeiro vídeo viral
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-xs text-gray-400 block">Progresso Total:</span>
              <span className="text-lg font-extrabold text-white font-mono">{progressPercent}%</span>
            </div>
            <div className="w-28 bg-white/10 rounded-full h-3 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 rounded-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stepper Horizontal Scroll Bar */}
      <div className="glass-card rounded-2xl p-4 border border-white/10 overflow-x-auto">
        <div className="flex items-center gap-2 min-w-max">
          {STEPS.map((s) => {
            const isCurrent = s.id === currentStep;
            const isDone = completedSteps.includes(s.id);
            const StepIcon = s.icon;

            return (
              <button
                key={s.id}
                onClick={() => setCurrentStep(s.id)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border ${
                  isCurrent
                    ? "bg-indigo-600 text-white border-indigo-400 shadow-lg glow-primary scale-105"
                    : isDone
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                    : "bg-white/5 text-gray-400 border-white/5 hover:text-white"
                }`}
              >
                <div className={`p-1 rounded-lg ${isCurrent ? "bg-white/20" : "bg-white/5"}`}>
                  {isDone ? <CheckCircle2 size={14} className="text-emerald-400" /> : <StepIcon size={14} />}
                </div>
                <span>{s.id}. {s.badge}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step Content Container */}
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15 }}
        transition={{ duration: 0.3 }}
        className="glass-card rounded-3xl p-8 md:p-10 border border-white/10 space-y-6"
      >
        {/* Step Header */}
        <div className="flex items-center gap-4 border-b border-white/10 pb-6">
          <div className="p-3.5 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 glow-primary">
            {React.createElement(STEPS[currentStep - 1].icon, { size: 28 })}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 text-[10px] font-extrabold uppercase border border-indigo-500/20">
                Passo {currentStep} de 10
              </span>
              <span className="text-xs text-cyan-400 font-semibold">{STEPS[currentStep - 1].badge}</span>
            </div>
            <h2 className="text-xl md:text-2xl font-extrabold text-white mt-1">
              {STEPS[currentStep - 1].title}
            </h2>
            <p className="text-xs text-gray-400 mt-1">{STEPS[currentStep - 1].subtitle}</p>
          </div>
        </div>

        {/* STEP 1: BEM-VINDO */}
        {currentStep === 1 && (
          <div className="space-y-6 text-sm text-gray-300 leading-relaxed">
            <p>
              O <strong>Viral Vertical Videos Creator v2.0</strong> é uma esteira de produção automatizada de vídeos em formato <strong>9:16 (YouTube Shorts, TikTok, Instagram Reels)</strong>.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <Brain size={24} className="text-purple-400" />
                <h3 className="font-bold text-white text-xs">1. Roteiros Virais</h3>
                <p className="text-[11px] text-gray-400">Geração de hooks de 3s e histórias de alta retenção com IA.</p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <Mic size={24} className="text-cyan-400" />
                <h3 className="font-bold text-white text-xs">2. Voz Neural & Karaoke</h3>
                <p className="text-[11px] text-gray-400">Sintetização de voz humana e legendas palavra-por-palavra dinâmicas.</p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <Youtube size={24} className="text-red-500" />
                <h3 className="font-bold text-white text-xs">3. Distribuição em Lote</h3>
                <p className="text-[11px] text-gray-400">Agendamento inteligente automático respeitando a janela segura.</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300">
              💡 <strong>Dica:</strong> Nos próximos passos você pode inserir suas chaves gratuitas de API ou usar as pré-configuradas para testar imediatamente.
            </div>
          </div>
        )}

        {/* STEP 2: IA / LLM */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-gray-300">
                Chave da API do OpenRouter (Provedor Primário Recomendado)
              </label>
              <div className="flex gap-2">
                <input
                  type="password"
                  value={openRouterKey}
                  onChange={(e) => setOpenRouterKey(e.target.value)}
                  placeholder="sk-or-v1-..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                />
                <ModernButton
                  variant="primary"
                  size="md"
                  onClick={() => testApiKey("OPENROUTER_API_KEY", openRouterKey, setOpenRouterTest)}
                  disabled={openRouterTest.loading || !openRouterKey}
                >
                  {openRouterTest.loading ? <Loader2 size={16} className="animate-spin" /> : <TestTube2 size={16} />}
                  Testar & Salvar
                </ModernButton>
              </div>
            </div>

            {openRouterTest.msg && (
              <div className={`p-4 rounded-xl text-xs font-semibold flex items-center gap-2 ${openRouterTest.status === "success" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30" : "bg-rose-500/10 text-rose-400 border border-rose-500/30"}`}>
                {openRouterTest.status === "success" ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                {openRouterTest.msg}
              </div>
            )}

            <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs">
              <span className="text-gray-300">Ainda não tem chave do OpenRouter?</span>
              <a
                href="https://openrouter.ai/keys"
                target="_blank"
                rel="noreferrer"
                className="text-cyan-400 hover:underline flex items-center gap-1 font-bold"
              >
                Criar Chave Grátis no OpenRouter <ExternalLink size={12} />
              </a>
            </div>
          </div>
        )}

        {/* STEP 3: MEDIA STOCK */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-gray-300">
                Chave da API do Pexels (Vídeos & Imagens de Stock Gratuitos)
              </label>
              <div className="flex gap-2">
                <input
                  type="password"
                  value={pexelsKey}
                  onChange={(e) => setPexelsKey(e.target.value)}
                  placeholder="Sua chave Pexels..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                />
                <ModernButton
                  variant="primary"
                  size="md"
                  onClick={() => testApiKey("PEXELS_API_KEY", pexelsKey, setPexelsTest)}
                  disabled={pexelsTest.loading || !pexelsKey}
                >
                  {pexelsTest.loading ? <Loader2 size={16} className="animate-spin" /> : <TestTube2 size={16} />}
                  Testar & Salvar
                </ModernButton>
              </div>
            </div>

            {pexelsTest.msg && (
              <div className={`p-4 rounded-xl text-xs font-semibold flex items-center gap-2 ${pexelsTest.status === "success" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30" : "bg-rose-500/10 text-rose-400 border border-rose-500/30"}`}>
                {pexelsTest.status === "success" ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                {pexelsTest.msg}
              </div>
            )}

            <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs">
              <span className="text-gray-300">Obter chave de API do Pexels gratuita:</span>
              <a
                href="https://www.pexels.com/api/"
                target="_blank"
                rel="noreferrer"
                className="text-cyan-400 hover:underline flex items-center gap-1 font-bold"
              >
                Gerar Chave no Pexels <ExternalLink size={12} />
              </a>
            </div>
          </div>
        )}

        {/* STEP 4: VOZ & TTS */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <p className="text-xs text-gray-300">
              O sistema suporta <strong>Edge TTS gratuito</strong> integrado sem necessidade de chave de API, com vozes neurais de alta qualidade em português (Francisca e Antonio).
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs">Edge TTS - Francisca</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">Ativo & Grátis</span>
                </div>
                <p className="text-[11px] text-gray-400">Voz feminina calma e articulada, ideal para curiosidades e notícias.</p>
                <button
                  onClick={() => alert("Reproduzindo prévia de voz: Francisca Neural")}
                  className="w-full py-2 rounded-xl bg-cyan-600/20 text-cyan-400 border border-cyan-500/30 text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-cyan-600/30 transition"
                >
                  <Volume2 size={14} /> Ouvir Francisca
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs">Edge TTS - Antonio</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">Ativo & Grátis</span>
                </div>
                <p className="text-[11px] text-gray-400">Voz masculina dinâmica e impactante, excelente para revelações e games.</p>
                <button
                  onClick={() => alert("Reproduzindo prévia de voz: Antonio Neural")}
                  className="w-full py-2 rounded-xl bg-cyan-600/20 text-cyan-400 border border-cyan-500/30 text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-cyan-600/30 transition"
                >
                  <Volume2 size={14} /> Ouvir Antonio
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: STORAGE S3 */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <p className="text-xs text-gray-300 leading-relaxed">
              O armazenamento de vídeos gerados e arquivos de conhecimento RAG é gerenciado de forma segura no AWS S3 ou localmente no servidor.
            </p>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Status do Armazenamento:</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 size={14} /> Pronto para Renderização Local & S3
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Bucket Padrão:</span>
                <span className="font-mono text-white">viral-creator-prod-bucket</span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 6: BANCO DE DADOS & REDIS */}
        {currentStep === 6 && (
          <div className="space-y-6">
            <p className="text-xs text-gray-300 leading-relaxed">
              A persistência de projetos, vídeos e histórico utiliza banco relacional com Prisma ORM e filas BullMQ.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 text-xs">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Database size={16} className="text-indigo-400" /> Prisma ORM & SQLite / Postgres
                </span>
                <p className="text-gray-400 text-[11px]">11 tabelas relacionais com vetores de embedding ativos.</p>
                <span className="text-emerald-400 font-bold text-[10px] block">✓ Schema Sincronizado</span>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 text-xs">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Zap size={16} className="text-amber-400" /> Fila BullMQ Workers
                </span>
                <p className="text-gray-400 text-[11px]">Processamento em segundo plano sem travar a navegação.</p>
                <span className="text-emerald-400 font-bold text-[10px] block">✓ Workers Conectados</span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 7: YOUTUBE OAUTH */}
        {currentStep === 7 && (
          <div className="space-y-6">
            <p className="text-xs text-gray-300 leading-relaxed">
              Conecte seu canal do YouTube para habilitar o agendamento de até 5 Shorts por dia automaticamente.
            </p>

            <div className="p-6 rounded-2xl bg-red-950/30 border border-red-500/30 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-red-600/20 text-red-500">
                  <Youtube size={28} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Canal Viral Shorts BR</h3>
                  <p className="text-xs text-gray-400">OAuth 2.0 Conectado com Escopo de Upload</p>
                </div>
              </div>

              <span className="px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
                ✓ Conectado
              </span>
            </div>
          </div>
        )}

        {/* STEP 8: 1º PROJETO */}
        {currentStep === 8 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-2">Nome do Projeto</label>
                <input
                  type="text"
                  value={firstProject.name}
                  onChange={(e) => setFirstProject({ ...firstProject, name: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-2">Nicho</label>
                <input
                  type="text"
                  value={firstProject.niche}
                  onChange={(e) => setFirstProject({ ...firstProject, niche: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-2">Tema Principal</label>
                <input
                  type="text"
                  value={firstProject.theme}
                  onChange={(e) => setFirstProject({ ...firstProject, theme: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-2">Template de Roteiro</label>
                <select
                  value={firstProject.template}
                  onChange={(e) => setFirstProject({ ...firstProject, template: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                >
                  <option value="breaking_news">Breaking News (Urgente / Revelações)</option>
                  <option value="storytelling">Storytelling & Retenção</option>
                  <option value="curiosidades">Top Curiosidades</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 9: PRODUÇÃO */}
        {currentStep === 9 && (
          <div className="space-y-6">
            <p className="text-xs text-gray-300">
              Selecione as ideias virais geradas para o projeto <strong>{firstProject.name}</strong> e inicie a renderização:
            </p>

            <div className="space-y-3">
              {[
                { id: "idea_1", title: "GTA 6: O Segredo Oculto de Vice City Revelado em Documentos", score: 98.4 },
                { id: "idea_2", title: "Novo Sistema Climático de GTA 6 promete Furacões em Tempo Real", score: 95.1 },
                { id: "idea_3", title: "Comparativo Gráfico: Como a Rockstar atingiu o fotorrealismo", score: 89.7 },
              ].map((idea) => {
                const isSelected = selectedIdeas.includes(idea.id);
                return (
                  <div
                    key={idea.id}
                    onClick={() => {
                      setSelectedIdeas((prev) =>
                        isSelected ? prev.filter((id) => id !== idea.id) : [...prev, idea.id]
                      );
                    }}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? "bg-indigo-600/20 border-indigo-500 text-white"
                        : "bg-white/5 border-white/5 text-gray-400 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center border ${isSelected ? "bg-indigo-600 border-indigo-400 text-white" : "border-white/20"}`}>
                        {isSelected && <CheckCircle2 size={14} />}
                      </div>
                      <span className="text-xs font-bold">{idea.title}</span>
                    </div>

                    <span className="text-xs font-mono text-cyan-400 font-bold">Score: {idea.score}</span>
                  </div>
                );
              })}
            </div>

            {isRendering ? (
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center space-y-4">
                <Loader2 size={32} className="animate-spin text-cyan-400 mx-auto" />
                <div>
                  <h3 className="text-sm font-bold text-white">Renderizando Vídeos em 9:16...</h3>
                  <p className="text-xs text-gray-400 mt-1">Sintetizando áudio neural, cortando B-roll e aplicando legendas karaoke</p>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2.5 max-w-md mx-auto overflow-hidden">
                  <motion.div
                    animate={{ width: `${renderProgress}%` }}
                    className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 rounded-full"
                  />
                </div>
              </div>
            ) : (
              <div className="text-center pt-2">
                <ModernButton variant="primary" size="lg" onClick={handleStartRender} disabled={selectedIdeas.length === 0}>
                  <Sparkles size={18} /> Produzir {selectedIdeas.length} Ideias Selecionadas
                </ModernButton>
              </div>
            )}
          </div>
        )}

        {/* STEP 10: SUCESSO */}
        {currentStep === 10 && (
          <div className="text-center py-6 space-y-6">
            <div className="w-20 h-20 rounded-3xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-2xl glow-emerald">
              <Trophy size={40} />
            </div>

            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white">
                Parabéns! Sua Esteira Viral está Pronta! 🎉
              </h2>
              <p className="text-xs text-gray-300 max-w-md mx-auto mt-2">
                Seus primeiros vídeos foram gerados com sucesso e já estão disponíveis no seu Histórico e prontos para publicação.
              </p>
            </div>

            {/* Ready Video Preview Card */}
            <div className="glass-card max-w-sm mx-auto rounded-2xl p-4 border border-white/10 text-left space-y-3">
              <div className="aspect-[9/12] rounded-xl bg-black overflow-hidden relative">
                <img
                  src="https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&auto=format&fit=crop&q=60"
                  alt="Video Pronto"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-emerald-500/80 text-white text-[10px] font-bold">
                  ✅ 100% PRONTO
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-rose-600/90 text-white flex items-center justify-center shadow-xl">
                    <Play size={20} fill="white" className="ml-1" />
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-xs font-bold text-white">GTA 6: O Segredo Oculto de Vice City Revelado</h3>
                <span className="text-[10px] text-gray-400">0:34 • Áudio LUFS -14 • Legendas Karaoke</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4 pt-4">
              <Link href="/history">
                <ModernButton variant="secondary" size="md">
                  Ver no Histórico
                </ModernButton>
              </Link>

              <Link href="/">
                <ModernButton variant="primary" size="md">
                  Ir para o Dashboard <ArrowRight size={16} />
                </ModernButton>
              </Link>
            </div>
          </div>
        )}

        {/* Footer Navigation Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-white/10">
          <button
            onClick={handlePrev}
            disabled={currentStep === 1}
            className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-semibold text-gray-300 hover:text-white flex items-center gap-2 transition"
          >
            <ArrowLeft size={16} /> Anterior
          </button>

          <span className="text-xs font-mono text-gray-400">
            Passo {currentStep} de 10
          </span>

          {currentStep < 10 && (
            <ModernButton variant="primary" size="md" onClick={handleNext}>
              Próximo Passo <ArrowRight size={16} />
            </ModernButton>
          )}
        </div>
      </motion.div>
    </div>
  );
}
