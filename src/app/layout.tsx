import "./globals.css";
import React from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Flame,
  FolderKanban,
  PlayCircle,
  BarChart3,
  Search,
  Bell,
  User,
  Zap,
  Sparkles,
} from "lucide-react";

export const metadata = {
  title: "Viral Vertical Videos Creator - Modern Web SaaS",
  description: "Plataforma Web SaaS de Automação de Vídeos Verticais em Lote",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen flex bg-background text-gray-100 antialiased selection:bg-indigo-500 selection:text-white bg-grid-pattern">
        {/* Modern Glassmorphism Sidebar */}
        <aside className="w-64 bg-[#141427]/80 backdrop-blur-xl border-r border-white/10 flex flex-col justify-between p-5 relative z-20">
          <div>
            {/* Brand Logo & Title */}
            <div className="flex items-center gap-3 mb-8 px-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-400 flex items-center justify-center font-extrabold text-white shadow-lg glow-primary">
                <Sparkles size={20} />
              </div>
              <div>
                <span className="font-extrabold text-lg tracking-tight gradient-text">
                  Viral Creator
                </span>
                <span className="block text-[10px] font-semibold tracking-widest text-cyan-400 uppercase">
                  v2.0 SaaS
                </span>
              </div>
            </div>

            {/* Navigation Menu */}
            <nav className="space-y-1.5">
              <Link
                href="/"
                className="flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm font-semibold text-gray-300 hover:text-white hover:bg-white/10 transition-all group"
              >
                <LayoutDashboard size={18} className="text-gray-400 group-hover:text-indigo-400 transition" />
                Dashboard
              </Link>
              <Link
                href="/discovery"
                className="flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm font-semibold text-gray-300 hover:text-white hover:bg-white/10 transition-all group"
              >
                <Flame size={18} className="text-amber-400 group-hover:scale-110 transition" />
                Tendências & Descoberta
              </Link>
              <Link
                href="/projects"
                className="flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm font-semibold text-gray-300 hover:text-white hover:bg-white/10 transition-all group"
              >
                <FolderKanban size={18} className="text-purple-400 group-hover:text-purple-300 transition" />
                Meus Projetos
              </Link>
              <Link
                href="/render-queue"
                className="flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm font-semibold text-gray-300 hover:text-white hover:bg-white/10 transition-all group"
              >
                <PlayCircle size={18} className="text-emerald-400 group-hover:text-emerald-300 transition" />
                Fila de Render
              </Link>
              <Link
                href="/analytics"
                className="flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm font-semibold text-gray-300 hover:text-white hover:bg-white/10 transition-all group"
              >
                <BarChart3 size={18} className="text-cyan-400 group-hover:text-cyan-300 transition" />
                Analytics
              </Link>
            </nav>
          </div>

          {/* Storage & Credit Balance Box */}
          <div className="pt-4 border-t border-white/10">
            <div className="glass-card rounded-xl p-3.5 border border-indigo-500/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
                  <Zap size={14} className="text-amber-400" /> Créditos API
                </span>
                <span className="text-xs font-bold text-cyan-400">42 / 100</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 rounded-full"
                  style={{ width: "42%" }}
                />
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Viewport */}
        <main className="flex-1 flex flex-col min-w-0">
          {/* Top Bar Header */}
          <header className="h-16 border-b border-white/10 bg-[#141427]/60 backdrop-blur-xl px-6 flex items-center justify-between relative z-10">
            {/* Global Search Bar */}
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-3.5 py-1.5 w-72 hover:border-indigo-500/40 transition">
              <Search size={16} className="text-gray-400" />
              <input
                type="text"
                placeholder="Buscar (Cmd + K)..."
                className="bg-transparent text-xs text-white placeholder-gray-400 focus:outline-none w-full"
              />
            </div>

            {/* Notification Bell & Profile Avatar */}
            <div className="flex items-center gap-4">
              <button className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition relative">
                <Bell size={18} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              </button>

              <div className="flex items-center gap-3 border-l border-white/10 pl-4">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                  <User size={18} />
                </div>
                <div className="text-xs hidden md:block">
                  <p className="font-semibold text-white">Criador Pro</p>
                  <p className="text-gray-400">dev@viralcreator.com</p>
                </div>
              </div>
            </div>
          </header>

          {/* Page Body Viewport */}
          <div className="flex-1 p-8 overflow-y-auto">{children}</div>
        </main>
      </body>
    </html>
  );
}
