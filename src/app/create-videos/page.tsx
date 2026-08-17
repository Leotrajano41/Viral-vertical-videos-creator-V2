"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Film,
  Settings2,
  FolderKanban,
  FileText,
  Sparkles,
  Upload,
  Play,
  Save,
  Volume2,
  CheckCircle2,
  Layers,
  Globe,
  Radio,
  FileSearch,
  BookOpen,
  ArrowRight,
  Plus,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { ModernButton } from "@/components/ui/modern/Button";
import Link from "next/link";

interface Project {
  id: string;
  name: string;
  niche: string;
  theme: string;
  language: string;
  country: string;
  durationMin: number;
  durationMax: number;
  format: string;
  promptMaster: string;
  template: string;
  voiceType: string;
  voiceSpeed?: number;
  musicVolume: number;
  subtitleMode?: string;
  headlineColor: string;
}

const TEMPLATES = [
  { id: "breaking_news", label: "Breaking News (Urgente / Revelações)" },
  { id: "storytelling", label: "Storytelling Emocionante & Retenção" },
  { id: "top5", label: "Top 5 / Ranking Curiosidades" },
  { id: "curiosidades", label: "Fatos Bizarros & Curiosidades Rápidas" },
  { id: "react", label: "React / Análise Crítica Viral" },
  { id: "tutorial", label: "Mini Tutorial / Dicas Práticas" },
  { id: "suspense", label: "Mistério & Suspense Psicológico" },
  { id: "motivacional", label: "Motivacional & Estoicismo" },
  { id: "comparativo", label: "Comparativo / Antes vs Depois" },
  { id: "quiz", label: "Quiz Interativo / Pergunta & Resposta" },
];

const VOICES = [
  { id: "pt-BR-FranciscaNeural", label: "Edge TTS - Francisca (Feminina / Noticiário)" },
  { id: "pt-BR-AntonioNeural", label: "Edge TTS - Antonio (Masculino / Dinâmico)" },
  { id: "pt-BR-ThalitaNeural", label: "Edge TTS - Thalita (Jovem / Shorts)" },
  { id: "en-US-GuyNeural", label: "Edge TTS - Guy (Inglês US)" },
  { id: "xtts_cloned_1", label: "XTTS v2 - Voz Clonada Mestre" },
  { id: "eleven_adam", label: "ElevenLabs - Adam (Premium)" },
];

const HEADLINE_COLORS = [
  { id: "yellow", label: "Amarelo Neon", class: "bg-yellow-400 text-black border-yellow-300" },
  { id: "lime", label: "Verde Lima", class: "bg-lime-400 text-black border-lime-300" },
  { id: "orange", label: "Laranja Vibrante", class: "bg-orange-500 text-white border-orange-400" },
  { id: "red", label: "Vermelho Alerta", class: "bg-red-500 text-white border-red-400" },
  { id: "white", label: "Branco Puro", class: "bg-white text-black border-gray-200" },
];

export default function CreateVideosPage() {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: "proj_gta6",
      name: "GTA 6 Vazações Virais",
      niche: "Games & Vazações",
      theme: "Rockstar Games & Vice City",
      language: "pt",
      country: "BR",
      durationMin: 25,
      durationMax: 40,
      format: "9:16",
      promptMaster: "Crie um roteiro magnético de alta retenção com hook inicial de 3 segundos, revelações chocantes e chamada para ação no final.",
      template: "breaking_news",
      voiceType: "pt-BR-AntonioNeural",
      voiceSpeed: 1.05,
      musicVolume: 0.30,
      subtitleMode: "1_word",
      headlineColor: "yellow",
    },
    {
      id: "proj_bonjovi",
      name: "Bon Jovi História do Rock",
      niche: "Música & Curiosidades",
      theme: "Anos 80 e 90 Turnês Históricas",
      language: "pt",
      country: "BR",
      durationMin: 30,
      durationMax: 45,
      format: "9:16",
      promptMaster: "Conte histórias ocultas e curiosidades pouco conhecidas do rock clássico.",
      template: "storytelling",
      voiceType: "pt-BR-FranciscaNeural",
      voiceSpeed: 1.0,
      musicVolume: 0.25,
      subtitleMode: "2_words",
      headlineColor: "lime",
    },
  ]);

  const [selectedProjectId, setSelectedProjectId] = useState<string>("proj_gta6");
  const [activeTab, setActiveTab] = useState<"basic" | "files" | "custom_script">("basic");
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Files Tab State
  const [indexedFiles, setIndexedFiles] = useState([
    { name: "gta6_vice_city_trailer_clips.mp4", type: "video", size: "45.2 MB", status: "Indexado" },
    { name: "rockstar_financial_report_2025.pdf", type: "knowledge", size: "3.1 MB", status: "Indexado RAG" },
    { name: "dark_synthwave_background.mp3", type: "music", size: "4.8 MB", status: "Indexado" },
    { name: "cta_subscribe_animated.mov", type: "cta", size: "8.4 MB", status: "Indexado" },
  ]);
  const [indexing, setIndexing] = useState(false);
  const [indexMessage, setIndexMessage] = useState("");

  // Custom Script Tab State
  const [customScript, setCustomScript] = useState({
    title: "O que a Rockstar não queria que você soubesse sobre GTA 6",
    headline: "GTA 6: MAPA REVELADO!",
    script: "Você sabia que o mapa de GTA 6 é 3 vezes maior do que o de GTA 5? Documentos internos vazados revelam mais de 5 cidades jogáveis e um sistema climático ultra dinâmico. Inscreva-se para não perder o lançamento oficial!",
  });
  const [producingScript, setProducingScript] = useState(false);
  const [produceSuccess, setProduceSuccess] = useState(false);

  const selectedProject = projects.find((p) => p.id === selectedProjectId);

  const handleUpdateProject = (field: keyof Project, value: any) => {
    if (!selectedProject) return;
    setProjects((prev) =>
      prev.map((p) => (p.id === selectedProjectId ? { ...p, [field]: value } : p))
    );
    setSaveSuccess(false);
  };

  const handleSaveSettings = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 500);
  };

  const handleIndexFiles = (type: string) => {
    setIndexing(true);
    setIndexMessage("");
    setTimeout(() => {
      setIndexing(false);
      setIndexMessage(`✅ Pasta de ${type} indexada com sucesso no motor RAG e S3!`);
      setTimeout(() => setIndexMessage(""), 4000);
    }, 1200);
  };

  const handleProduceCustomScript = () => {
    setProducingScript(true);
    setTimeout(() => {
      setProducingScript(false);
      setProduceSuccess(true);
      setTimeout(() => setProduceSuccess(false), 4000);
    }, 1500);
  };

  const wordCount = customScript.script.trim().split(/\s+/).filter(Boolean).length;
  const estimatedSeconds = Math.round((wordCount / 140) * 60);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header Banner & Project Selector */}
      <div className="glass-card rounded-3xl p-8 border border-white/10 relative overflow-hidden bg-gradient-to-r from-indigo-900/40 via-cyan-900/30 to-purple-900/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-3">
              <Film size={14} /> Esteira de Criação & Produção
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white">
              Criar Vídeos Verticais
            </h1>
            <p className="text-xs text-gray-300 mt-1">
              Configure as regras de geração, indexe materiais de estudo e produza roteiros virais
            </p>
          </div>

          {/* Project Switcher Dropdown */}
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 p-2 rounded-2xl">
            <span className="text-xs text-gray-400 pl-2">Projeto:</span>
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="bg-[#141427] border border-indigo-500/30 text-xs font-bold text-white rounded-xl px-4 py-2.5 focus:outline-none cursor-pointer hover:border-indigo-400 transition"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.format})
                </option>
              ))}
            </select>
            <Link href="/projects">
              <button className="p-2 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 text-xs font-semibold flex items-center gap-1 transition">
                <Plus size={16} /> Novo
              </button>
            </Link>
          </div>
        </div>
      </div>

      {!selectedProject ? (
        /* Empty State: No Project Selected */
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card rounded-3xl p-12 border border-white/10 text-center max-w-xl mx-auto space-y-4"
        >
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto border border-indigo-500/30">
            <FolderKanban size={32} />
          </div>
          <h2 className="text-xl font-bold text-white">Nenhum Projeto Selecionado</h2>
          <p className="text-xs text-gray-400">
            Selecione ou crie um projeto na aba Projetos para configurar as regras e produzir vídeos.
          </p>
          <Link href="/projects">
            <ModernButton variant="primary" size="md">
              Ir para Projetos <ArrowRight size={16} />
            </ModernButton>
          </Link>
        </motion.div>
      ) : (
        /* Project Loaded: 3 Tabs (Básica, Arquivos, Roteiro próprio) */
        <div className="space-y-6">
          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-white/10 pb-4">
            <button
              onClick={() => setActiveTab("basic")}
              className={`px-5 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === "basic"
                  ? "bg-indigo-600 text-white shadow-lg glow-primary"
                  : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
              }`}
            >
              <Settings2 size={16} />
              1. Configurações Básicas
            </button>
            <button
              onClick={() => setActiveTab("files")}
              className={`px-5 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === "files"
                  ? "bg-indigo-600 text-white shadow-lg glow-primary"
                  : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
              }`}
            >
              <Layers size={16} />
              2. Arquivos & Conhecimento RAG
            </button>
            <button
              onClick={() => setActiveTab("custom_script")}
              className={`px-5 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === "custom_script"
                  ? "bg-indigo-600 text-white shadow-lg glow-primary"
                  : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
              }`}
            >
              <FileText size={16} />
              3. Roteiro Próprio
            </button>
          </div>

          {/* TAB 1: BÁSICA */}
          {activeTab === "basic" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-2xl p-8 border border-white/10 space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Nome do Projeto */}
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-2">Nome do Projeto</label>
                  <input
                    type="text"
                    value={selectedProject.name}
                    onChange={(e) => handleUpdateProject("name", e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500/50"
                  />
                </div>

                {/* Nicho */}
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-2">Nicho</label>
                  <input
                    type="text"
                    value={selectedProject.niche}
                    onChange={(e) => handleUpdateProject("niche", e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500/50"
                  />
                </div>

                {/* Tema */}
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-2">Tema Principal</label>
                  <input
                    type="text"
                    value={selectedProject.theme}
                    onChange={(e) => handleUpdateProject("theme", e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-4 border-t border-white/5">
                {/* Idioma */}
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-2">Idioma</label>
                  <select
                    value={selectedProject.language}
                    onChange={(e) => handleUpdateProject("language", e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                  >
                    <option value="pt">🇧🇷 Português (Brasil)</option>
                    <option value="en">🇺🇸 Inglês (EUA)</option>
                    <option value="es">🇪🇸 Espanhol</option>
                  </select>
                </div>

                {/* País */}
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-2">País Alvo</label>
                  <select
                    value={selectedProject.country}
                    onChange={(e) => handleUpdateProject("country", e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                  >
                    <option value="BR">Brasil (BR)</option>
                    <option value="US">Estados Unidos (US)</option>
                    <option value="ES">Espanha (ES)</option>
                  </select>
                </div>

                {/* Duração */}
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-2">
                    Duração ({selectedProject.durationMin}s - {selectedProject.durationMax}s)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={selectedProject.durationMin}
                      onChange={(e) => handleUpdateProject("durationMin", parseInt(e.target.value))}
                      className="w-1/2 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                    />
                    <span className="text-gray-400 text-xs">até</span>
                    <input
                      type="number"
                      value={selectedProject.durationMax}
                      onChange={(e) => handleUpdateProject("durationMax", parseInt(e.target.value))}
                      className="w-1/2 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>

                {/* Formato */}
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-2">Formato</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleUpdateProject("format", "9:16")}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold border transition ${
                        selectedProject.format === "9:16"
                          ? "bg-indigo-600/30 border-indigo-500 text-white"
                          : "bg-white/5 border-white/10 text-gray-400"
                      }`}
                    >
                      9:16 (Shorts/TikTok)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleUpdateProject("format", "16:9")}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold border transition ${
                        selectedProject.format === "16:9"
                          ? "bg-indigo-600/30 border-indigo-500 text-white"
                          : "bg-white/5 border-white/10 text-gray-400"
                      }`}
                    >
                      16:9 (Horizontal)
                    </button>
                  </div>
                </div>
              </div>

              {/* Template & Prompt Mestre */}
              <div className="space-y-4 pt-4 border-t border-white/5">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-2">
                    Template de Roteiro (10 Modelos de Alta Retenção)
                  </label>
                  <select
                    value={selectedProject.template}
                    onChange={(e) => handleUpdateProject("template", e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none cursor-pointer"
                  >
                    {TEMPLATES.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-2">
                    Prompt Mestre da IA
                  </label>
                  <textarea
                    rows={3}
                    value={selectedProject.promptMaster}
                    onChange={(e) => handleUpdateProject("promptMaster", e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500/50 leading-relaxed font-mono"
                  />
                </div>
              </div>

              {/* Voz, Volume, Legendas e Headline */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-4 border-t border-white/5">
                {/* Voz */}
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-2">Voz do Narrador</label>
                  <select
                    value={selectedProject.voiceType}
                    onChange={(e) => handleUpdateProject("voiceType", e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
                  >
                    {VOICES.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Volume Música */}
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-2">
                    Volume da Música: {Math.round((selectedProject.musicVolume || 0.3) * 100)}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={selectedProject.musicVolume}
                    onChange={(e) => handleUpdateProject("musicVolume", parseFloat(e.target.value))}
                    className="w-full accent-indigo-500"
                  />
                </div>

                {/* Modo Legenda */}
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-2">Estilo de Legenda Karaoke</label>
                  <select
                    value={selectedProject.subtitleMode || "1_word"}
                    onChange={(e) => handleUpdateProject("subtitleMode", e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
                  >
                    <option value="1_word">1 Palavra em Destaque (Estilo MrBeast)</option>
                    <option value="2_words">2 Palavras por Bloco</option>
                    <option value="3_words">3 Palavras por Bloco</option>
                    <option value="short_phrase">Frase Curta Dinâmica</option>
                  </select>
                </div>

                {/* Cor Headline */}
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-2">Cor da Headline Superior</label>
                  <div className="flex gap-2">
                    {HEADLINE_COLORS.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => handleUpdateProject("headlineColor", c.id)}
                        className={`w-8 h-8 rounded-lg border-2 transition ${c.class} ${
                          selectedProject.headlineColor === c.id ? "scale-110 ring-2 ring-white" : "opacity-60"
                        }`}
                        title={c.label}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                <button className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-xs font-semibold flex items-center gap-2 transition">
                  <Volume2 size={16} /> Ouvir Prévia da Voz
                </button>

                <div className="flex items-center gap-3">
                  {saveSuccess && (
                    <span className="text-xs text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 size={14} /> Configurações salvas!
                    </span>
                  )}
                  <ModernButton variant="primary" size="md" onClick={handleSaveSettings} disabled={saving}>
                    {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    Salvar Alterações
                  </ModernButton>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: ARQUIVOS & RAG */}
          {activeTab === "files" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-2xl p-8 border border-white/10 space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center space-y-3">
                  <Film size={24} className="text-cyan-400 mx-auto" />
                  <h3 className="text-xs font-bold text-white">Vídeos de Fundo (B-Roll)</h3>
                  <p className="text-[11px] text-gray-400">Clipes 9:16 ou 16:9 cortados</p>
                  <button
                    onClick={() => handleIndexFiles("Vídeos")}
                    className="w-full py-2 rounded-lg bg-cyan-600/20 text-cyan-400 border border-cyan-500/30 text-xs font-semibold hover:bg-cyan-600/30 transition"
                  >
                    Indexar Vídeos
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center space-y-3">
                  <BookOpen size={24} className="text-purple-400 mx-auto" />
                  <h3 className="text-xs font-bold text-white">Conhecimento RAG</h3>
                  <p className="text-[11px] text-gray-400">PDF, TXT, DOCX de estudo</p>
                  <button
                    onClick={() => handleIndexFiles("Conhecimento")}
                    className="w-full py-2 rounded-lg bg-purple-600/20 text-purple-400 border border-purple-500/30 text-xs font-semibold hover:bg-purple-600/30 transition"
                  >
                    Indexar RAG
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center space-y-3">
                  <Volume2 size={24} className="text-amber-400 mx-auto" />
                  <h3 className="text-xs font-bold text-white">Trilhas de Fundo</h3>
                  <p className="text-[11px] text-gray-400">Músicas instrumentais .mp3</p>
                  <button
                    onClick={() => handleIndexFiles("Músicas")}
                    className="w-full py-2 rounded-lg bg-amber-600/20 text-amber-400 border border-amber-500/30 text-xs font-semibold hover:bg-amber-600/30 transition"
                  >
                    Indexar Músicas
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center space-y-3">
                  <Radio size={24} className="text-emerald-400 mx-auto" />
                  <h3 className="text-xs font-bold text-white">Clipes de CTA</h3>
                  <p className="text-[11px] text-gray-400">Inscreva-se / Curtir / Seguir</p>
                  <button
                    onClick={() => handleIndexFiles("CTA")}
                    className="w-full py-2 rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold hover:bg-emerald-600/30 transition"
                  >
                    Indexar CTA
                  </button>
                </div>
              </div>

              {/* Status Feedback */}
              {indexing && (
                <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center gap-3 text-xs text-indigo-300">
                  <Loader2 size={16} className="animate-spin" />
                  Processando arquivos e gerando vetores de embeddings no banco...
                </div>
              )}

              {indexMessage && (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-400 font-semibold">
                  {indexMessage}
                </div>
              )}

              {/* Indexed Files Table */}
              <div className="pt-4 border-t border-white/5">
                <h3 className="text-xs font-bold text-white mb-3">Arquivos Indexados do Projeto</h3>
                <div className="space-y-2">
                  {indexedFiles.map((f, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <FileSearch size={16} className="text-indigo-400" />
                        <span className="font-mono text-white">{f.name}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-gray-400">{f.size}</span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                          {f.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 3: ROTEIRO PRÓPRIO */}
          {activeTab === "custom_script" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              {/* Script Editor */}
              <div className="lg:col-span-2 glass-card rounded-2xl p-8 border border-white/10 space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-2">Título do Vídeo</label>
                  <input
                    type="text"
                    value={customScript.title}
                    onChange={(e) => setCustomScript({ ...customScript, title: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-2">
                    Headline Superior (Texto em Caixa Alta)
                  </label>
                  <input
                    type="text"
                    value={customScript.headline}
                    onChange={(e) => setCustomScript({ ...customScript, headline: e.target.value.toUpperCase() })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500/50 font-bold tracking-wider"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-gray-300">Roteiro Completo para Narração</label>
                    <span className="text-[11px] text-gray-400">
                      {wordCount} palavras • ~{estimatedSeconds} segundos estimados
                    </span>
                  </div>
                  <textarea
                    rows={6}
                    value={customScript.script}
                    onChange={(e) => setCustomScript({ ...customScript, script: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-xs text-white focus:outline-none focus:border-indigo-500/50 leading-relaxed"
                  />
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <Link href="/render-queue">
                    <span className="text-xs text-cyan-400 hover:underline">Ver Fila de Render →</span>
                  </Link>

                  <ModernButton
                    variant="primary"
                    size="md"
                    onClick={handleProduceCustomScript}
                    disabled={producingScript}
                  >
                    {producingScript ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                    🚀 Produzir este Roteiro
                  </ModernButton>
                </div>

                {produceSuccess && (
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-400 font-semibold flex items-center gap-2">
                    <CheckCircle2 size={16} />
                    Job adicionado à Fila de Render com sucesso! O vídeo já está sendo sintetizado.
                  </div>
                )}
              </div>

              {/* 9:16 Video Preview Mockup */}
              <div className="glass-card rounded-2xl p-6 border border-white/10 flex flex-col items-center justify-between">
                <h3 className="text-xs font-bold text-white mb-4">Prévia do Layout 9:16</h3>

                <div className="w-56 h-96 rounded-2xl bg-black border-2 border-indigo-500/40 relative overflow-hidden flex flex-col justify-between p-4 shadow-2xl">
                  {/* Headline Banner */}
                  <div className="w-full py-1.5 px-2 bg-yellow-400 rounded text-center shadow-lg">
                    <span className="text-[10px] font-black text-black tracking-tight leading-tight block">
                      {customScript.headline || "HEADLINE AQUI"}
                    </span>
                  </div>

                  {/* Center Karaoke Subtitle Mockup */}
                  <div className="text-center my-auto">
                    <span className="text-sm font-extrabold text-white bg-black/70 px-2 py-1 rounded shadow">
                      {customScript.script.slice(0, 30)}...
                    </span>
                  </div>

                  {/* Bottom Watermark */}
                  <div className="text-center text-[8px] text-gray-500 uppercase tracking-widest">
                    {selectedProject.name}
                  </div>
                </div>

                <p className="text-[10px] text-gray-400 mt-4 text-center">
                  Formato: 1080x1920 (9:16) • Taxa de quadros: 30 FPS • Normalização EBU R128 (-14 LUFS)
                </p>
              </div>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}
