"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "success";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export const ModernButton: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  children,
  className = "",
  ...props
}) => {
  const variantStyles = {
    primary:
      "bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 text-white shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 border border-indigo-400/30",
    secondary:
      "bg-surface border border-white/10 text-gray-200 hover:bg-white/10 hover:border-white/20 hover:text-white",
    ghost: "bg-transparent text-gray-400 hover:text-white hover:bg-white/5",
    danger:
      "bg-gradient-to-r from-rose-600 to-red-500 text-white shadow-lg shadow-rose-600/30 hover:shadow-rose-600/50",
    success:
      "bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-600/30 hover:shadow-emerald-600/50",
  };

  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs font-medium rounded-lg gap-1.5",
    md: "px-4 py-2.5 text-sm font-semibold rounded-xl gap-2",
    lg: "px-6 py-3.5 text-base font-bold rounded-2xl gap-3",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className={`inline-flex items-center justify-center transition-all duration-200 cursor-pointer ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};
