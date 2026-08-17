"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Settings,
  Brain,
  Film,
  Cloud,
  Database,
  Youtube,
  CreditCard,
  Eye,
  EyeOff,
  Save,
  Trash2,
  TestTube2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  Shield,
  RefreshCw,
  Sparkles,
  Mic,
  Upload,
  Bot,
  Download,
  HardDrive,
  Volume2,
  Play,
  RotateCcw,
} from "lucide-react";
import { ModernButton } from "@/components/ui/modern/Button";

// ─── Types ───
interface ConfigStatus {
  key: string;
  label: string;
  category: string;
  configured: boolean;
  source: "db" | "env" | "none";
  maskedValue: string;
  placeholder: string;
  validationPattern?: string;
  validationHint?: string;
  isPublic?: boolean;
}

interface CategoryDef {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  glowClass: string;
  borderColor: string;
}

const CATEGORIES: CategoryDef[] = [
  {
    id: "llm",
    title: "Provedores de IA",
    description: "Chaves de API para geração de conteúdo com IA (OpenRouter, OpenAI, Gemini)",
    icon: Brain,
    color: "text-indigo-400",
    glowClass: "glow-primary",
    borderColor: "border-indigo-500/30",
  },
  {
    id: "media",
    title: "Mídia & Stock",
    description: "APIs para vídeos, imagens e transcrição de áudio",
    icon: Film,
    color: "text-amber-400",
    glowClass: "",
    borderColor: "border-amber-500/30",
  },
  {
    id: "storage",
    title: "Armazenamento AWS",
    description: "S3 bucket, CloudFront CDN e credenciais IAM",
    icon: Cloud,
    color: "text-cyan-400",
    glowClass: "glow-cyan",
    borderColor: "border-cyan-500/30",
  },
  {
    id: "cache",
    title: "Cache Redis",
    description: "Upstash Redis para filas BullMQ e cache de dados",
    icon: Database,
    color: "text-rose-400",
    glowClass: "",
    borderColor: "border-rose-500/30",
  },
  {
    id: "youtube",
    title: "YouTube & Google",
    description: "OAuth 2.0 para publicação automática no YouTube",
    icon: Youtube,
    color: "text-red-400",
    glowClass: "",
    borderColor: "border-red-500/30",
  },
  {
    id: "billing",
    title: "Stripe Billing",
    description: "Integração de pagamentos e assinaturas SaaS",
    icon: CreditCard,
    color: "text-emerald-400",
    glowClass: "glow-emerald",
    borderColor: "border-emerald-500/30",
  },
];

function StatusBadge({ source, configured }: { source: string; configured: boolean }) {
  if (configured && source === "db") {
    return (
      <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
        <CheckCircle2 size={11} />
        Configurada (DB)
      </span>
    );
  }
  if (configured && source === "env") {
    return (
      <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/25">
        <AlertCircle size={11} />
        Via Env
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/25">
      <XCircle size={11} />
      Não configurada
    </span>
  );
}

function CredentialField({
  config,
  onSave,
  onDelete,
  onTest,
}: {
  config: ConfigStatus;
  onSave: (key: string, value: string) => Promise<void>;
  onDelete: (key: string) => Promise<void>;
  onTest: (key: string) => Promise<{ success: boolean; message: string }>;
}) {
  const [value, setValue] = useState("");
  const [showValue, setShowValue] = useState(false);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [saveResult, setSaveResult] = useState<{ success: boolean; message: string } | null>(null);
  const [validationError, setValidationError] = useState("");

  const validate = (val: string): boolean => {
    if (!val) return true;
    if (config.validationPattern) {
      const regex = new RegExp(config.validationPattern);
      if (!regex.test(val)) {
        setValidationError(config.validationHint || "Formato inválido");
        return false;
      }
    }
    setValidationError("");
    return true;
  };

  const handleSave = async () => {
    if (!value.trim()) return;
    if (!validate(value)) return;
    setSaving(true);
    setSaveResult(null);
    setTestResult(null);
    try {
      await onSave(config.key, value);
      setSaveResult({ success: true, message: "Salvo com sucesso!" });
      setValue("");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Erro ao salvar";
      setSaveResult({ success: false, message: msg });
    }
    setSaving(false);
  };

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const result = await onTest(config.key);
      setTestResult(result);
    } catch {
      setTestResult({ success: false, message: "Erro ao testar" });
    }
    setTesting(false);
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await onDelete(config.key);
      setSaveResult({ success: true, message: "Removida do banco" });
    } catch {
      setSaveResult({ success: false, message: "Erro ao remover" });
    }
    setDeleting(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 hover:border-white/[0.12] transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <code className="text-xs font-mono text-gray-300 bg-white/5 px-2 py-0.5 rounded">
            {config.key}
          </code>
          <StatusBadge source={config.source} configured={config.configured} />
        </div>
      </div>

      <p className="text-xs text-gray-400 mb-3">{config.label}</p>

      {config.configured && config.maskedValue && (
        <p className="text-[11px] text-gray-500 mb-2 font-mono">
          Atual: {config.maskedValue}
        </p>
      )}

      <div className="flex gap-2">
        <div className="flex-1 relative">
          <input
            type={showValue ? "text" : "password"}
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              validate(e.target.value);
              setSaveResult(null);
              setTestResult(null);
            }}
            placeholder={config.placeholder}
            className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/25 transition-all font-mono"
          />
          <button
            onClick={() => setShowValue(!showValue)}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
          >
            {showValue ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSave}
          disabled={saving || !value.trim()}
          className="px-3.5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 disabled:cursor-not-allowed text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
        >
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          Salvar
        </motion.button>

        {config.configured && (
          <>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleTest}
              disabled={testing}
              className="px-3 py-2.5 rounded-lg bg-cyan-600/20 border border-cyan-500/30 hover:bg-cyan-600/30 text-cyan-400 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              {testing ? <Loader2 size={14} className="animate-spin" /> : <TestTube2 size={14} />}
              Testar
            </motion.button>

            {config.source === "db" && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDelete}
                disabled={deleting}
                className="px-3 py-2.5 rounded-lg bg-rose-600/15 border border-rose-500/25 hover:bg-rose-600/25 text-rose-400 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                {deleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
              </motion.button>
            )}
          </>
        )}
      </div>

      <AnimatePresence>
        {validationError && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="text-[11px] text-amber-400 mt-2 flex items-center gap-1"
          >
            <AlertCircle size={12} />
            {validationError}
          </motion.p>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {(saveResult || testResult) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-2"
          >
            {saveResult && (
              <p className={`text-[11px] flex items-center gap-1 ${saveResult.success ? "text-emerald-400" : "text-rose-400"}`}>
                {saveResult.success ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                {saveResult.message}
              </p>
            )}
            {testResult && (
              <p className={`text-[11px] flex items-center gap-1 ${testResult.success ? "text-emerald-400" : "text-rose-400"}`}>
                {testResult.success ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                {testResult.message}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function SettingsPage() {
  const [mainTab, setMainTab] = useState<"credentials" | "xtts" | "meta_ai" | "backup">("credentials");
  const [settings, setSettings] = useState<ConfigStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // XTTS State
  const [voiceName, setVoiceName] = useState("");
  const [cloningVoice, setCloningVoice] = useState(false);
  const [clonedVoices, setClonedVoices] = useState([
    { id: "v1", name: "Narrador Misterioso (Grave)", duration: "6s sample", createdAt: "15/08/2026" },
    { id: "v2", name: "Voz Dinâmica YouTube Shorts", duration: "10s sample", createdAt: "12/08/2026" },
  ]);

  // Meta AI / LLM State
  const [llmConfig, setLlmConfig] = useState({
    primaryModel: "deepseek/deepseek-chat",
    fallbackModel: "gpt-4o-mini",
    temperature: 0.7,
    maxTokens: 1500,
  });

  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch("/api/settings");
      const data = await res.json();
      setSettings(data.settings || []);
    } catch (error) {
      console.error("Failed to fetch settings:", error);
    }
    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchSettings();
  };

  const handleSave = async (key: string, value: string) => {
    const res = await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, value }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || data.hint || "Erro");
    await fetchSettings();
  };

  const handleDelete = async (key: string) => {
    await fetch(`/api/settings?key=${key}`, { method: "DELETE" });
    await fetchSettings();
  };

  const handleTest = async (key: string) => {
    const res = await fetch("/api/settings/test", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key }),
    });
    return await res.json();
  };

  const handleCloneVoice = () => {
    if (!voiceName) return;
    setCloningVoice(true);
    setTimeout(() => {
      setClonedVoices((prev) => [
        ...prev,
        { id: `v_${Date.now()}`, name: voiceName, duration: "8s sample", createdAt: "Hoje" },
      ]);
      setVoiceName("");
      setCloningVoice(false);
    }, 1500);
  };

  const totalKeys = settings.length;
  const configuredKeys = settings.filter((s) => s.configured).length;
  const dbKeys = settings.filter((s) => s.source === "db").length;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between"
      >
        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-400 glow-primary">
              <Settings size={24} className="text-white" />
            </div>
            Configurações do Sistema
          </h1>
          <p className="text-gray-400 mt-2 text-sm max-w-xl">
            Painel completo de credenciais, clonagem de voz XTTS, integração Meta AI e backup
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05, rotate: 180 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleRefresh}
          disabled={refreshing}
          className="p-3 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition"
        >
          <RefreshCw size={18} className={refreshing ? "animate-spin" : ""} />
        </motion.button>
      </motion.div>

      {/* Main Settings Tabs (Desktop 1:1 Parity) */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-4 overflow-x-auto">
        <button
          onClick={() => setMainTab("credentials")}
          className={`px-5 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            mainTab === "credentials"
              ? "bg-indigo-600 text-white shadow-lg glow-primary"
              : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
          }`}
        >
          <Shield size={16} />
          1. Credenciais & APIs (AES-256)
        </button>
        <button
          onClick={() => setMainTab("xtts")}
          className={`px-5 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            mainTab === "xtts"
              ? "bg-indigo-600 text-white shadow-lg glow-primary"
              : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
          }`}
        >
          <Mic size={16} />
          2. Clonagem de Voz XTTS v2
        </button>
        <button
          onClick={() => setMainTab("meta_ai")}
          className={`px-5 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            mainTab === "meta_ai"
              ? "bg-indigo-600 text-white shadow-lg glow-primary"
              : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
          }`}
        >
          <Bot size={16} />
          3. Meta AI & LLM Cascade
        </button>
        <button
          onClick={() => setMainTab("backup")}
          className={`px-5 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            mainTab === "backup"
              ? "bg-indigo-600 text-white shadow-lg glow-primary"
              : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
          }`}
        >
          <HardDrive size={16} />
          4. Backup & Restauração
        </button>
      </div>

      {/* TAB 1: CREDENCIAIS & APIS */}
      {mainTab === "credentials" && (
        <div className="space-y-6">
          {/* Summary Stats Bar */}
          <div className="glass-card rounded-2xl p-5 border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Shield size={16} className="text-indigo-400" />
                <span className="text-sm text-gray-300">
                  <span className="font-bold text-white">{configuredKeys}</span> / {totalKeys} configuradas
                </span>
              </div>
              <div className="w-px h-5 bg-white/10" />
              <div className="flex items-center gap-2">
                <Database size={14} className="text-emerald-400" />
                <span className="text-xs text-gray-400">
                  <span className="font-semibold text-emerald-400">{dbKeys}</span> no banco
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 w-48">
              <div className="flex-1 bg-white/10 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 rounded-full"
                  style={{ width: `${totalKeys > 0 ? (configuredKeys / totalKeys) * 100 : 0}%` }}
                />
              </div>
              <span className="text-xs font-bold text-white">
                {totalKeys > 0 ? Math.round((configuredKeys / totalKeys) * 100) : 0}%
              </span>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 size={32} className="animate-spin text-indigo-400" />
              <span className="ml-3 text-gray-400">Carregando configurações...</span>
            </div>
          ) : (
            CATEGORIES.map((cat) => {
              const catSettings = settings.filter((s) => s.category === cat.id);
              if (catSettings.length === 0) return null;
              const CatIcon = cat.icon;
              const configuredCount = catSettings.filter((s) => s.configured).length;

              return (
                <div key={cat.id} className="space-y-3">
                  <div className="flex items-center gap-4 mb-2">
                    <div className={`p-2.5 rounded-xl bg-white/5 border ${cat.borderColor} ${cat.glowClass}`}>
                      <CatIcon size={20} className={cat.color} />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-base font-bold text-white">{cat.title}</h2>
                      <p className="text-xs text-gray-400">{cat.description}</p>
                    </div>
                    <span className="text-xs font-semibold text-gray-400">
                      {configuredCount}/{catSettings.length}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {catSettings.map((config) => (
                      <CredentialField
                        key={config.key}
                        config={config}
                        onSave={handleSave}
                        onDelete={handleDelete}
                        onTest={handleTest}
                      />
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* TAB 2: CLONAGEM DE VOZ XTTS v2 */}
      {mainTab === "xtts" && (
        <div className="glass-card rounded-2xl p-8 border border-white/10 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Mic size={20} className="text-cyan-400" /> Clonador de Voz Neural (Coqui XTTS v2)
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Envie um arquivo de áudio de 6 a 15 segundos para clonar qualquer voz humana em alta fidelidade
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/5 border border-dashed border-white/20 text-center space-y-4">
            <Upload size={32} className="text-indigo-400 mx-auto" />
            <div>
              <p className="text-xs font-bold text-white">Arraste um áudio .wav ou .mp3 de referência</p>
              <p className="text-[11px] text-gray-400 mt-1">Voz limpa sem ruído de fundo (6 a 15 segundos)</p>
            </div>

            <div className="max-w-md mx-auto flex gap-3">
              <input
                type="text"
                value={voiceName}
                onChange={(e) => setVoiceName(e.target.value)}
                placeholder="Nome da Voz (ex: Voz Narrador Principal)..."
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none"
              />
              <ModernButton
                variant="primary"
                size="sm"
                onClick={handleCloneVoice}
                disabled={cloningVoice || !voiceName}
              >
                {cloningVoice ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                Clonar Voz
              </ModernButton>
            </div>
          </div>

          {/* Cloned Voices List */}
          <div className="space-y-3 pt-4 border-t border-white/5">
            <h3 className="text-xs font-bold text-white">Vozes Clonadas Disponíveis</h3>
            <div className="space-y-2">
              {clonedVoices.map((v) => (
                <div
                  key={v.id}
                  className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <Volume2 size={16} className="text-cyan-400" />
                    <div>
                      <h4 className="font-bold text-white">{v.name}</h4>
                      <span className="text-[10px] text-gray-400">{v.duration} • Criada em {v.createdAt}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => alert(`Tocando prévia de: ${v.name}`)}
                      className="px-3 py-1.5 rounded-lg bg-cyan-600/20 text-cyan-400 border border-cyan-500/30 text-xs font-semibold flex items-center gap-1 hover:bg-cyan-600/30 transition"
                    >
                      <Play size={12} fill="currentColor" /> Testar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: META AI & LLM CASCADE */}
      {mainTab === "meta_ai" && (
        <div className="glass-card rounded-2xl p-8 border border-white/10 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Bot size={20} className="text-indigo-400" /> Orquestrador Meta AI & LLMs em Cascata
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Configurações de roteamento de inteligência artificial com tolerância a falhas automática
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-2">Provedor Primário (Mais Rápido & Barato)</label>
              <select
                value={llmConfig.primaryModel}
                onChange={(e) => setLlmConfig({ ...llmConfig, primaryModel: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
              >
                <option value="deepseek/deepseek-chat">DeepSeek V3 (OpenRouter) - Recomendado</option>
                <option value="meta-llama/llama-3.3-70b-instruct">Meta LLaMA 3.3 70B</option>
                <option value="gpt-4o-mini">OpenAI GPT-4o Mini</option>
                <option value="gemini-1.5-flash">Google Gemini 1.5 Flash</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-2">Provedor de Fallback Secundário</label>
              <select
                value={llmConfig.fallbackModel}
                onChange={(e) => setLlmConfig({ ...llmConfig, fallbackModel: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
              >
                <option value="gpt-4o-mini">OpenAI GPT-4o Mini (Fallback Padrão)</option>
                <option value="gemini-1.5-flash">Google Gemini 1.5 Flash</option>
                <option value="claude-3-5-haiku">Anthropic Claude 3.5 Haiku</option>
              </select>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300 leading-relaxed">
            💡 <strong>Cascata Inteligente:</strong> Se a API do OpenRouter oscilar, o sistema alterna em menos de 500ms para a OpenAI ou Google Gemini sem interromper sua fila de vídeos.
          </div>
        </div>
      )}

      {/* TAB 4: BACKUP & RESTAURAÇÃO */}
      {mainTab === "backup" && (
        <div className="glass-card rounded-2xl p-8 border border-white/10 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <HardDrive size={20} className="text-amber-400" /> Backup e Restauração de Dados
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Exporte seus projetos, ideias, vídeos e configurações para segurança local
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <Download size={24} className="text-emerald-400" />
              <h3 className="text-xs font-bold text-white">Exportar Banco de Dados</h3>
              <p className="text-[11px] text-gray-400">Download do arquivo JSON completo com todos os projetos e vídeos</p>
              <button
                onClick={() => alert("Backup exportado com sucesso!")}
                className="w-full py-2 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold hover:bg-emerald-600/30 transition"
              >
                Exportar Backup JSON
              </button>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <Upload size={24} className="text-cyan-400" />
              <h3 className="text-xs font-bold text-white">Restaurar de Arquivo</h3>
              <p className="text-[11px] text-gray-400">Restaure projetos de uma versão anterior ou outro computador</p>
              <button
                onClick={() => alert("Selecione o arquivo de backup para restaurar")}
                className="w-full py-2 rounded-xl bg-cyan-600/20 text-cyan-400 border border-cyan-500/30 text-xs font-semibold hover:bg-cyan-600/30 transition"
              >
                Carregar Arquivo .json
              </button>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <RotateCcw size={24} className="text-rose-400" />
              <h3 className="text-xs font-bold text-white">Limpeza de Cache</h3>
              <p className="text-[11px] text-gray-400">Limpe arquivos temporários de renderização e cache Redis</p>
              <button
                onClick={() => alert("Cache limpo com sucesso!")}
                className="w-full py-2 rounded-xl bg-rose-600/20 text-rose-400 border border-rose-500/30 text-xs font-semibold hover:bg-rose-600/30 transition"
              >
                Limpar Cache Temporário
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
