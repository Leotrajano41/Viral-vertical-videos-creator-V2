"use client";

import React, { useState, useEffect } from "react";
import { BarChart3, TrendingUp, Eye, ThumbsUp, MessageSquare, Award } from "lucide-react";

export default function AnalyticsPage() {
  const [data, setData] = useState({
    totalViews: 1420000,
    totalLikes: 98500,
    totalComments: 14200,
    engagementRate: "8.4%",
    publishedCount: 142,
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <BarChart3 className="text-indigo-400" />
            Analytics & Desempenho dos Canais
          </h1>
          <p className="text-xs text-gray-400">Estatísticas pós-publicação e métricas de engajamento</p>
        </div>
      </div>

      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-surface border border-border p-5 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 font-medium">Visualizações Totais</p>
            <h3 className="text-2xl font-bold text-white mt-1">{data.totalViews.toLocaleString()}</h3>
          </div>
          <div className="p-3 bg-indigo-500/10 rounded-lg text-indigo-400">
            <Eye size={24} />
          </div>
        </div>

        <div className="bg-surface border border-border p-5 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 font-medium">Curtidas / Likes</p>
            <h3 className="text-2xl font-bold text-white mt-1">{data.totalLikes.toLocaleString()}</h3>
          </div>
          <div className="p-3 bg-emerald-500/10 rounded-lg text-emerald-400">
            <ThumbsUp size={24} />
          </div>
        </div>

        <div className="bg-surface border border-border p-5 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 font-medium">Comentários</p>
            <h3 className="text-2xl font-bold text-white mt-1">{data.totalComments.toLocaleString()}</h3>
          </div>
          <div className="p-3 bg-amber-500/10 rounded-lg text-amber-400">
            <MessageSquare size={24} />
          </div>
        </div>

        <div className="bg-surface border border-border p-5 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 font-medium">Taxa de Engajamento</p>
            <h3 className="text-2xl font-bold text-white mt-1">{data.engagementRate}</h3>
          </div>
          <div className="p-3 bg-rose-500/10 rounded-lg text-rose-400">
            <TrendingUp size={24} />
          </div>
        </div>
      </div>

      {/* Performance Bar Overview */}
      <div className="bg-surface border border-border rounded-xl p-6 space-y-4">
        <h2 className="text-base font-semibold text-white">Desempenho dos Últimos 7 Dias</h2>
        <div className="h-48 flex items-end gap-4 pt-8 justify-between border-b border-border pb-4">
          {[
            { day: "Seg", val: 65 },
            { day: "Ter", val: 80 },
            { day: "Qua", val: 45 },
            { day: "Qui", val: 95 },
            { day: "Sex", val: 110 },
            { day: "Sáb", val: 140 },
            { day: "Dom", val: 160 },
          ].map((bar) => (
            <div key={bar.day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
              <div
                className="w-full bg-indigo-500 hover:bg-indigo-400 rounded-t-md transition-all duration-300"
                style={{ height: `${(bar.val / 160) * 100}%` }}
              ></div>
              <span className="text-xs text-gray-400 font-mono">{bar.day}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
