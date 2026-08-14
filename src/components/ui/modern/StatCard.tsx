"use client";

import React from "react";
import { motion } from "framer-motion";
import { LucideIcon, TrendingUp } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtext?: string;
  icon: LucideIcon;
  color?: "indigo" | "emerald" | "amber" | "cyan" | "rose";
  trend?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtext,
  icon: Icon,
  color = "indigo",
  trend,
}) => {
  const colorMap = {
    indigo: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20 glow-primary",
    emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 glow-emerald",
    amber: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    cyan: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20 glow-cyan",
    rose: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  };

  return (
    <motion.div
      whileHover={{ y: -5, boxShadow: "0 15px 35px rgba(99, 102, 241, 0.2)" }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="glass-card rounded-2xl p-6 border border-white/10 relative overflow-hidden group"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-600/10 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500 pointer-events-none" />

      <div className="flex items-start justify-between relative z-10">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">{title}</p>
          <h3 className="text-3xl font-extrabold text-white mt-2 tracking-tight">{value}</h3>
          {subtext && <p className="text-xs text-gray-400 mt-1">{subtext}</p>}
          {trend && (
            <div className="flex items-center gap-1 text-xs font-semibold text-emerald-400 mt-2">
              <TrendingUp size={14} />
              <span>{trend}</span>
            </div>
          )}
        </div>
        <div className={`p-3.5 rounded-xl border ${colorMap[color]} transition-transform duration-300 group-hover:scale-110`}>
          <Icon size={24} />
        </div>
      </div>
    </motion.div>
  );
};
