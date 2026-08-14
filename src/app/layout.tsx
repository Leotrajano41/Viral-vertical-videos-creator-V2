import "./globals.css";
import React from "react";
import Link from "next/link";
import { LayoutDashboard, Flame, FolderKanban, Cpu, PlayCircle, BarChart3 } from "lucide-react";

export const metadata = {
  title: "Viral Vertical Videos Creator - Web SaaS",
  description: "Plataforma Web SaaS de Automação de Vídeos Verticais em Lote",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen flex bg-background text-gray-100 antialiased">
        {/* Sidebar */}
        <aside className="w-64 bg-surface border-r border-border flex flex-col justify-between p-4">
          <div>
            <div className="flex items-center gap-2 mb-8 px-2">
              <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center font-bold text-white">
                V2
              </div>
              <span className="font-bold text-lg tracking-wide text-white">Viral Creator</span>
            </div>

            <nav className="space-y-1">
              <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-border transition text-gray-300 hover:text-white">
                <LayoutDashboard size={18} />
                Dashboard
              </Link>
              <Link href="/discovery" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-border transition text-gray-300 hover:text-white">
                <Flame size={18} className="text-amber-500" />
                Descoberta & Trends
              </Link>
              <Link href="/projects" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-border transition text-gray-300 hover:text-white">
                <FolderKanban size={18} />
                Meus Projetos
              </Link>
              <Link href="/render-queue" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-border transition text-gray-300 hover:text-white">
                <PlayCircle size={18} className="text-emerald-400" />
                Fila de Render
              </Link>
              <Link href="/analytics" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-border transition text-gray-300 hover:text-white">
                <BarChart3 size={18} className="text-indigo-400" />
                Analytics
              </Link>
            </nav>
          </div>

          <div className="pt-4 border-t border-border">
            <div className="flex items-center gap-3 px-2 py-2">
              <Cpu size={18} className="text-accent" />
              <div className="text-xs">
                <p className="font-medium text-gray-200">Plano Pro SaaS</p>
                <p className="text-gray-400">42 / 100 Créditos</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Viewport */}
        <main className="flex-1 flex flex-col min-w-0">
          <header className="h-16 border-b border-border bg-surface px-6 flex items-center justify-between">
            <h1 className="text-sm font-semibold text-gray-300">VIRAL VERTICAL VIDEOS CREATOR v2.0 WEB SaaS</h1>
            <div className="flex items-center gap-4">
              <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Cloud Workers: Active
              </span>
            </div>
          </header>
          <div className="flex-1 p-6 overflow-y-auto">{children}</div>
        </main>
      </body>
    </html>
  );
}
