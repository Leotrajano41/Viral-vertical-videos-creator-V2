"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Settings,
  Cpu,
  Youtube,
  Key,
  Mic,
  AlertTriangle,
  HardDrive,
  CheckCircle2,
  Save,
  Upload,
  Download,
  FileText,
  RotateCcw,
  Sparkles,
  Info,
} from "lucide-react";
import { ModernButton } from "@/components/ui/modern/Button";

export default function OriginalSettingsPage() {
  // 1. Renderizações simultâneas state
  const [renderMode, setRenderMode] = useState("auto");
  const [renderSaved, setRenderSaved] = useState(false);

  // 2. YouTube Cookies state
  const [cookieMode, setCookieMode] = useState("auto");
  const [cookiePath, setCookiePath] = useState("");
  const [cookieSaved, setCookieSaved] = useState(false);

  // 5. Adicionar minha voz state
  const [customVoiceName, setCustomVoiceName] = useState("");
  const [customVoiceLang, setCustomVoiceLang] = useState("pt");
  const [customVoiceFile, setCustomVoiceFile] = useState<string | null>(null);
  const [customVoices, setCustomVoices] = useState<Array<{ name: string; lang: string; file: string }>>([]);
  const [voiceSuccess, setVoiceSuccess] = useState(false);

  // 6. Backup checkboxes state
  const [backupSerial, setBackupSerial] = useState(true);
  const [backupDatabase, setBackupDatabase] = useState(true);
  const [backupMetaAI, setBackupMetaAI] = useState(false);
  const [backupMessage, setBackupMessage] = useState("");

  const handleSaveRender = () => {
    setRenderSaved(true);
    setTimeout(() => setRenderSaved(false), 3000);
  };

  const handleSaveCookies = () => {
    setCookieSaved(true);
    setTimeout(() => setCookieSaved(false), 3000);
  };

  const handleRegisterVoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customVoiceName) return;
    setCustomVoices((prev) => [
      ...prev,
      {
        name: customVoiceName,
        lang: customVoiceLang === "pt" ? "Português" : "Inglês",
        file: customVoiceFile || "amostra_audio.wav",
      },
    ]);
    setCustomVoiceName("");
    setCustomVoiceFile(null);
    setVoiceSuccess(true);
    setTimeout(() => setVoiceSuccess(false), 3000);
  };

  const handleGenerateBackup = () => {
    setBackupMessage("✅ Arquivo de backup compactado gerado com sucesso! (backup_viral_creator.zip)");
    setTimeout(() => setBackupMessage(""), 5000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Header Banner */}
      <div className="glass-card rounded-3xl p-8 border border-white/10 relative overflow-hidden bg-gradient-to-r from-blue-950/40 via-indigo-900/30 to-purple-900/40">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
            <Settings size={28} />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white">
              Configurações
            </h1>
            <p className="text-xs text-gray-300 mt-1">
              Ajustes do sistema, cookies do YouTube, chaves de API, vozes e backup
            </p>
          </div>
        </div>
      </div>

      {/* =====================================================
          1. RENDERIZAÇÕES SIMULTÂNEAS
          ===================================================== */}
      <section className="glass-card rounded-2xl p-6 md:p-8 border border-white/10 space-y-4">
        <h2 className="text-base font-bold text-blue-400 flex items-center gap-2">
          <Cpu size={18} /> Renderizações simultâneas
        </h2>
        <p className="text-xs text-gray-300 leading-relaxed">
          Define quantos vídeos podem ser sintetizados e renderizados em paralelo pela GPU e CPU do seu computador.
        </p>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 pt-2">
          <select
            value={renderMode}
            onChange={(e) => setRenderMode(e.target.value)}
            className="w-full sm:w-80 bg-white/5 border border-white/10 text-xs font-semibold text-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="auto">Automático (detecta GPU/CPU)</option>
            <option value="1">1 vídeo por vez</option>
            <option value="2">2 vídeos simultâneos</option>
            <option value="3">3 vídeos simultâneos</option>
          </select>

          <ModernButton variant="primary" size="sm" onClick={handleSaveRender}>
            <Save size={14} /> Salvar
          </ModernButton>

          {renderSaved && (
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 size={14} /> Salvo!
            </span>
          )}
        </div>

        <div className="pt-2 text-[11px] text-gray-400">
          Status: <span className="text-emerald-400 font-mono">Hardware Acceleration ativo (Apple VideoToolbox / NVENC)</span>
        </div>
      </section>

      {/* =====================================================
          2. YOUTUBE — COOKIES
          ===================================================== */}
      <section className="glass-card rounded-2xl p-6 md:p-8 border border-white/10 space-y-4">
        <h2 className="text-base font-bold text-blue-400 flex items-center gap-2">
          <Youtube size={18} className="text-red-500" /> YouTube — cookies (contorna &quot;Sign in to confirm you&apos;re not a bot&quot;)
        </h2>
        
        <p className="text-xs text-gray-300 leading-relaxed">
          Quando o YouTube bloqueia downloads/transcrições, usar os cookies de uma conta logada resolve. O modo &quot;navegador&quot; precisa do navegador FECHADO; o arquivo cookies.txt funciona sempre (exporte com a extensão &quot;Get cookies.txt LOCALLY&quot; estando logado no YouTube).
        </p>

        <div className="space-y-3 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] text-gray-400 mb-1">Modo de Captura de Cookies</label>
              <select
                value={cookieMode}
                onChange={(e) => setCookieMode(e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-xs font-semibold text-white rounded-xl px-4 py-2.5 focus:outline-none cursor-pointer"
              >
                <option value="auto">Automático (só quando bloquear)</option>
                <option value="none">Não usar</option>
                <option value="chrome">Chrome</option>
                <option value="edge">Edge</option>
                <option value="firefox">Firefox</option>
                <option value="brave">Brave</option>
                <option value="opera">Opera</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] text-gray-400 mb-1">Arquivo de Cookies Local</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={cookiePath}
                  onChange={(e) => setCookiePath(e.target.value)}
                  placeholder="(vazio = usa cookies.txt na pasta do app)"
                  className="flex-1 bg-white/5 border border-white/10 text-xs text-white rounded-xl px-3 py-2.5 focus:outline-none placeholder-gray-500 font-mono"
                />
                <button
                  type="button"
                  onClick={() => alert("Selecione o arquivo cookies.txt exportado")}
                  className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-gray-300 font-semibold transition"
                >
                  Arquivo...
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-emerald-400 flex items-center gap-1.5 font-semibold">
              <CheckCircle2 size={14} /> ✓ usando automático (só tenta o navegador quando o YouTube bloquear)
            </span>

            <ModernButton variant="primary" size="sm" onClick={handleSaveCookies}>
              <Save size={14} /> Salvar
            </ModernButton>
          </div>

          {cookieSaved && (
            <p className="text-xs text-emerald-400 font-semibold">
              ✓ Configuração de cookies do YouTube atualizada com sucesso.
            </p>
          )}
        </div>
      </section>

      {/* =====================================================
          3. CHAVES DE API DA SUA CONTA
          ===================================================== */}
      <section className="glass-card rounded-2xl p-6 md:p-8 border border-white/10 space-y-4">
        <h2 className="text-base font-bold text-blue-400 flex items-center gap-2">
          <Key size={18} /> Chaves de API da sua conta
        </h2>
        <p className="text-xs text-gray-300 leading-relaxed">
          Trazidas automaticamente do sistema pelo seu serial. Não há entrada manual — o cadastro é feito na plataforma Points.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0" />
              <div>
                <span className="font-bold text-white block">OpenAI (IA)</span>
                <span className="text-[11px] text-gray-400 font-mono">sk-proj-****...389d</span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
              ✓ Ativo
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0" />
              <div>
                <span className="font-bold text-white block">AssemblyAI (transcrição)</span>
                <span className="text-[11px] text-gray-400 font-mono">1 arq, 56 kB limit</span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
              ✓ Ativo
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0" />
              <div>
                <span className="font-bold text-white block">Pexels (banco de vídeos)</span>
                <span className="text-[11px] text-gray-400 font-mono">w3 library identifier</span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
              ✓ Ativo
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0" />
              <div>
                <span className="font-bold text-white block">Pixabay (banco de mídia)</span>
                <span className="text-[11px] text-gray-400 font-mono">45343...0c0f</span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
              ✓ Ativo
            </span>
          </div>
        </div>
      </section>

      {/* =====================================================
          4. CLONAGEM DE VOZ (XTTS)
          ===================================================== */}
      <section className="glass-card rounded-2xl p-6 md:p-8 border border-white/10 space-y-4">
        <h2 className="text-base font-bold text-blue-400 flex items-center gap-2">
          <Mic size={18} /> Clonagem de voz (XTTS)
        </h2>

        {/* Orange Warning Banner */}
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs leading-relaxed space-y-1">
          <div className="flex items-center gap-2 font-bold text-amber-400">
            <AlertTriangle size={16} /> ⚠ Recurso exclusivo da versão Windows. Neste Mac, use as vozes prontas (Edge TTS).
          </div>
          <p className="text-[11px] text-amber-200/90 pl-6">
            A clonagem de voz (XTTS) só existe na versão Windows. No Mac use as vozes prontas do Edge TTS — são mais de 300, em vários idiomas.
          </p>
        </div>

        <div className="pt-2">
          <button
            type="button"
            disabled
            className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-500 text-xs font-semibold flex items-center gap-2 cursor-not-allowed opacity-50"
            title="Disponível na versão Windows"
          >
            <Download size={14} /> ⬇️ Instalar XTTS (Disponível no Windows)
          </button>
        </div>
      </section>

      {/* =====================================================
          5. ADICIONAR MINHA VOZ
          ===================================================== */}
      <section className="glass-card rounded-2xl p-6 md:p-8 border border-white/10 space-y-4">
        <h2 className="text-base font-bold text-blue-400 flex items-center gap-2">
          <Mic size={18} /> Adicionar minha voz
        </h2>

        <form onSubmit={handleRegisterVoice} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">Nome</label>
              <input
                type="text"
                value={customVoiceName}
                onChange={(e) => setCustomVoiceName(e.target.value)}
                placeholder="Ex: Minha voz"
                className="w-full bg-white/5 border border-white/10 text-xs text-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">Idioma da Voz</label>
              <select
                value={customVoiceLang}
                onChange={(e) => setCustomVoiceLang(e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-xs font-semibold text-white rounded-xl px-4 py-2.5 focus:outline-none cursor-pointer"
              >
                <option value="pt">Português</option>
                <option value="en">Inglês</option>
                <option value="es">Espanhol</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Amostra de áudio (6-30s, WAV/MP3)
            </label>
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              <button
                type="button"
                onClick={() => setCustomVoiceFile("amostra_minha_voz.wav")}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-gray-200 border border-white/10 flex items-center gap-2 transition"
              >
                <Upload size={14} /> Escolher arquivo...
              </button>

              {customVoiceFile && (
                <span className="text-xs font-mono text-cyan-400">
                  Arquivo: {customVoiceFile}
                </span>
              )}

              <ModernButton
                type="submit"
                variant="primary"
                size="sm"
                disabled={!customVoiceName}
              >
                <Sparkles size={14} /> Cadastrar voz
              </ModernButton>
            </div>
          </div>
        </form>

        {voiceSuccess && (
          <p className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
            <CheckCircle2 size={14} /> Perfil de voz cadastrado com sucesso!
          </p>
        )}

        {/* Custom Voices Area */}
        <div className="pt-2 border-t border-white/5">
          {customVoices.length === 0 ? (
            <p className="text-xs text-gray-500 italic">Nenhuma voz cadastrada.</p>
          ) : (
            <div className="space-y-2">
              {customVoices.map((v, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between text-xs"
                >
                  <span className="font-bold text-white">{v.name} ({v.lang})</span>
                  <span className="text-[11px] text-cyan-400 font-mono">{v.file}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* =====================================================
          6. 💾 BACKUP E RESTAURAÇÃO DOS SEUS DADOS
          ===================================================== */}
      <section className="glass-card rounded-2xl p-6 md:p-8 border border-white/10 space-y-5">
        <h2 className="text-base font-bold text-blue-400 flex items-center gap-2">
          💾 Backup e restauração dos seus dados
        </h2>

        <p className="text-xs text-gray-300 leading-relaxed">
          Gere backups periódicos para proteger seus projetos, ideias, históricos e chaves ativadas. Você pode restaurar em qualquer computador a qualquer momento.
        </p>

        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
            1) Gerar backup
          </h3>

          <div className="space-y-2.5">
            <label className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 cursor-pointer transition">
              <input
                type="checkbox"
                checked={backupSerial}
                onChange={(e) => setBackupSerial(e.target.checked)}
                className="mt-0.5 accent-blue-500 rounded"
              />
              <div className="text-xs">
                <span className="font-bold text-white block">Licença ativada (serial)</span>
                <span className="text-[11px] text-gray-400">1 arq, 1 KB — Sem isto o cliente tem que ativar o serial de novo</span>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 cursor-pointer transition">
              <input
                type="checkbox"
                checked={backupDatabase}
                onChange={(e) => setBackupDatabase(e.target.checked)}
                className="mt-0.5 accent-blue-500 rounded"
              />
              <div className="text-xs">
                <span className="font-bold text-white block">Projetos, ideias, fila, histórico e ajustes</span>
                <span className="text-[11px] text-gray-400">1 arq, 56 kB — O banco do app inteiro</span>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 cursor-pointer transition">
              <input
                type="checkbox"
                checked={backupMetaAI}
                onChange={(e) => setBackupMetaAI(e.target.checked)}
                className="mt-0.5 accent-blue-500 rounded"
              />
              <div className="text-xs">
                <span className="font-bold text-white block">Contas do Meta AI (sessões já logadas)</span>
                <span className="text-[11px] text-gray-400">
                  nada a salvar — Só volta logado se rodar na MESMA máquina e no mesmo usuário do Windows (o Chrome marca o cookie ao perfil)
                </span>
              </div>
            </label>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-3">
            <ModernButton variant="primary" size="md" onClick={handleGenerateBackup}>
              <Download size={16} /> Gerar Backup Agora
            </ModernButton>

            <button
              type="button"
              onClick={() => alert("Selecione o arquivo de backup (.zip) para restaurar")}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-gray-200 border border-white/10 flex items-center gap-2 transition"
            >
              <Upload size={14} /> Restaurar Backup de Arquivo...
            </button>
          </div>

          {backupMessage && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-400 font-semibold flex items-center gap-2">
              <CheckCircle2 size={16} />
              {backupMessage}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
