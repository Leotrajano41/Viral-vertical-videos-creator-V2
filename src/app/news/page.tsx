"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Newspaper,
  Search,
  Globe,
  Plus,
  Sparkles,
  TrendingUp,
  ExternalLink,
  Clock,
  Flame,
  Radio,
} from "lucide-react";
import { ModernButton } from "@/components/ui/modern/Button";
import Link from "next/link";

interface NewsItem {
  id: string;
  title: string;
  source: string;
  category: string;
  publishedAt: string;
  views: number;
  viralityScore: number;
  snippet: string;
  url: string;
}

export default function NewsDiscoveryPage() {
  const [searchTerm, setSearchTerm] = useState("Inteligência Artificial");
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [loading, setLoading] = useState(false);

  const [news, setNews] = useState<NewsItem[]>([
    {
      id: "news_1",
      title: "OpenAI e Google anunciam novos modelos revolucionários que operam direto no navegador",
      source: "TechCrunch Brasil",
      category: "Tecnologia",
      publishedAt: "Há 15 min",
      views: 520000,
      viralityScore: 99.2,
      snippet: "Especialistas apontam que a nova geração de IA elimina intermediários e muda completamente a forma como trabalhamos.",
      url: "https://news.google.com",
    },
    {
      id: "news_2",
      title: "PlayStation 6 pode ser lançado antes do previsto com foco total em gráficos 8K e Ray Tracing",
      source: "IGN Brasil",
      category: "Games",
      publishedAt: "Há 40 min",
      views: 340000,
      viralityScore: 94.7,
      snippet: "Vazamentos industriais revelam que a Sony já está enviando kits de desenvolvimento preliminares para estúdios parceiros.",
      url: "https://ign.com",
    },
    {
      id: "news_3",
      title: "Descoberta Arqueológica Inédita no Egito revela câmara subterrânea com mais de 3 mil anos",
      source: "BBC News",
      category: "Mundo",
      publishedAt: "Há 1 hora",
      views: 210000,
      viralityScore: 89.1,
      snippet: "Pesquisadores utilizaram tecnologia de varredura laser para localizar a entrada de uma tumba preservada intacta.",
      url: "https://bbc.com",
    },
    {
      id: "news_4",
      title: "Transferência bombástica no futebol europeu agita os bastidores da Champions League",
      source: "Globo Esporte",
      category: "Esportes",
      publishedAt: "Há 2 horas",
      views: 480000,
      viralityScore: 91.5,
      snippet: "Clube inglês prepara oferta recorde de 150 milhões de euros para fechar contratação na janela de transferências.",
      url: "https://ge.globo.com",
    },
  ]);

  const categories = ["Todas", "Tecnologia", "Games", "Mundo", "Esportes", "Economia", "Celebridades"];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 600);
  };

  const filteredNews =
    selectedCategory === "Todas"
      ? news
      : news.filter((n) => n.category.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="glass-card rounded-3xl p-8 border border-white/10 relative overflow-hidden bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-purple-900/40">
        <div className="flex items-center gap-4 mb-2">
          <div className="p-3 rounded-2xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
            <Newspaper size={28} />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white">
              Notícias Frescas & Radar em Tempo Real
            </h1>
            <p className="text-xs text-gray-300">
              Descubra os acontecimentos mais recentes e transforme fatos urgentes em roteiros de alta retenção
            </p>
          </div>
        </div>
      </div>

      {/* Search & Category Filter Controls */}
      <div className="space-y-4">
        <form
          onSubmit={handleSearch}
          className="glass-card rounded-2xl p-4 border border-white/10 flex flex-col md:flex-row gap-4 items-center justify-between"
        >
          <div className="flex-1 flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 w-full focus-within:border-blue-500/50 transition">
            <Search size={18} className="text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar notícias recentes (ex: Inteligência Artificial, Games, Fórmula 1)..."
              className="bg-transparent text-sm text-white placeholder-gray-400 focus:outline-none w-full font-medium"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <select className="bg-white/5 border border-white/10 text-xs font-semibold text-gray-300 rounded-xl px-3.5 py-3 focus:outline-none cursor-pointer">
              <option value="BR">🇧🇷 Brasil (G1, CNN, UOL)</option>
              <option value="US">🇺🇸 Global (Reuters, BBC, NYT)</option>
            </select>

            <ModernButton type="submit" variant="primary" size="md" className="w-full md:w-auto">
              {loading ? <Sparkles size={18} className="animate-spin" /> : <Search size={18} />}
              Buscar Notícias
            </ModernButton>
          </div>
        </form>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                selectedCategory === cat
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* News Feed Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredNews.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.1 }}
            className="glass-card rounded-2xl p-6 border border-white/10 hover:border-blue-500/40 transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-1 text-[10px] font-extrabold rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  {item.category.toUpperCase()}
                </span>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-gray-400 flex items-center gap-1">
                    <Clock size={12} /> {item.publishedAt}
                  </span>
                  <span className="font-bold text-cyan-400 flex items-center gap-1">
                    <TrendingUp size={14} /> Score: {item.viralityScore}
                  </span>
                </div>
              </div>

              <h3 className="text-base font-bold text-white group-hover:text-blue-300 transition leading-snug">
                {item.title}
              </h3>

              <p className="text-xs text-gray-400 mt-2 leading-relaxed line-clamp-2">
                {item.snippet}
              </p>

              <div className="mt-3 text-[11px] text-gray-500 flex items-center gap-2">
                <span>Fonte: <strong className="text-gray-300">{item.source}</strong></span>
                <span>•</span>
                <span>{(item.views / 1000).toFixed(0)}k visualizações estimadas</span>
              </div>
            </div>

            <div className="pt-5 border-t border-white/10 mt-5 flex items-center justify-between">
              <a
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-gray-400 hover:text-white flex items-center gap-1 transition"
              >
                Ler na Fonte <ExternalLink size={12} />
              </a>

              <Link href={`/create-videos`}>
                <ModernButton variant="primary" size="sm">
                  <Sparkles size={14} /> + Criar Vídeo Desta Notícia
                </ModernButton>
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
