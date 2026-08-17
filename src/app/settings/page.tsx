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
} from "lucide-react";

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

// ─── Components ───

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
    if (!val) return true; // Empty is ok (not submitted yet)
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

      {/* Masked current value */}
      {config.configured && config.maskedValue && (
        <p className="text-[11px] text-gray-500 mb-2 font-mono">
          Atual: {config.maskedValue}
        </p>
      )}

      {/* Input Row */}
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

        {/* Action Buttons */}
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

      {/* Validation Error */}
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

      {/* Save/Test Result */}
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

// ─── Main Page ───

export default function SettingsPage() {
  const [settings, setSettings] = useState<ConfigStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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

  // Summary stats
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
            Configurações
          </h1>
          <p className="text-gray-400 mt-2 text-sm max-w-xl">
            Configure suas chaves de API e credenciais de serviços externos. Todos os valores são
            armazenados <span className="text-cyan-400 font-semibold">criptografados com AES-256</span> no banco de dados.
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

      {/* Summary Stats Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card rounded-2xl p-5 border border-white/10 flex items-center justify-between"
      >
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
          <div className="w-px h-5 bg-white/10" />
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-amber-400" />
            <span className="text-xs text-gray-400">
              <span className="font-semibold text-amber-400">{configuredKeys - dbKeys}</span> via env
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center gap-3 w-48">
          <div className="flex-1 bg-white/10 rounded-full h-2 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: totalKeys > 0 ? `${(configuredKeys / totalKeys) * 100}%` : "0%" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 rounded-full"
            />
          </div>
          <span className="text-xs font-bold text-white">
            {totalKeys > 0 ? Math.round((configuredKeys / totalKeys) * 100) : 0}%
          </span>
        </div>
      </motion.div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin text-indigo-400" />
          <span className="ml-3 text-gray-400">Carregando configurações...</span>
        </div>
      )}

      {/* Category Sections */}
      {!loading &&
        CATEGORIES.map((cat, catIdx) => {
          const catSettings = settings.filter((s) => s.category === cat.id);
          if (catSettings.length === 0) return null;
          const CatIcon = cat.icon;
          const configuredCount = catSettings.filter((s) => s.configured).length;

          return (
            <motion.section
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + catIdx * 0.05 }}
            >
              {/* Category Header */}
              <div className="flex items-center gap-4 mb-4">
                <div
                  className={`p-2.5 rounded-xl bg-white/5 border ${cat.borderColor} ${cat.glowClass}`}
                >
                  <CatIcon size={20} className={cat.color} />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-bold text-white">{cat.title}</h2>
                  <p className="text-xs text-gray-400">{cat.description}</p>
                </div>
                <span className="text-xs font-semibold text-gray-400">
                  {configuredCount}/{catSettings.length}
                </span>
              </div>

              {/* Credential Fields */}
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
            </motion.section>
          );
        })}

      {/* Security Notice */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="glass-card rounded-2xl p-5 border border-indigo-500/15"
      >
        <div className="flex items-start gap-3">
          <Shield size={20} className="text-indigo-400 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-bold text-white mb-1">Segurança</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Todas as credenciais são criptografadas com <span className="text-cyan-400 font-semibold">AES-256-CBC</span> antes
              de serem armazenadas no banco de dados. Um IV aleatório é gerado para cada valor. As chaves nunca são exibidas
              em texto puro — apenas versões mascaradas são mostradas na interface. Se uma chave for removida do banco, o
              sistema usa automaticamente o valor da variável de ambiente (se configurada na Vercel).
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
