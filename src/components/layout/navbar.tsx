"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { Menu, X, Sun, Moon } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { CONTAINER_CLASS } from "@/lib/constants";

const navLinks = [
  { label: "Módulos", href: "#modulos" },
  { label: "Como Funciona", href: "#como-funciona" },
  { label: "Planos", href: "#planos" },
  { label: "FAQ", href: "#faq" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[var(--bg-primary)]/80 backdrop-blur-xl border-b border-[var(--border-color)] shadow-sm"
          : "bg-transparent"
      }`}
    >
      <nav className={CONTAINER_CLASS}>
        <div className="flex h-16 items-center justify-between">
          <Logo />

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="relative px-4 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-brand-600 transition-colors rounded-lg hover:bg-brand-50 dark:hover:bg-brand-950/30"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {mounted && (
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-brand-600 transition-colors"
                aria-label="Alternar tema"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={theme}
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                  </motion.div>
                </AnimatePresence>
              </motion.button>
            )}

            <Link
              href="/login"
              className="hidden sm:inline-flex text-sm font-medium text-[var(--text-secondary)] hover:text-brand-600 transition-colors px-3 py-2"
            >
              Entrar
            </Link>

            <Link
              href="/cadastro"
              className="hidden sm:inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-brand-700 transition-colors"
            >
              Começar grátis
            </Link>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="flex md:hidden h-9 w-9 items-center justify-center rounded-lg border border-[var(--border-color)] text-[var(--text-secondary)]"
              aria-label="Menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden border-t border-[var(--border-color)]"
            >
              <div className="flex flex-col gap-1 py-4">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="px-4 py-3 text-sm font-medium text-[var(--text-secondary)] hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-950/30 rounded-lg transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
                <div className="mt-3 flex flex-col gap-2 px-4">
                  <Link
                    href="/login"
                    className="text-center py-2.5 text-sm font-medium text-[var(--text-secondary)] border border-[var(--border-color)] rounded-lg"
                  >
                    Entrar
                  </Link>
                  <Link
                    href="/cadastro"
                    className="text-center py-2.5 text-sm font-semibold text-white bg-brand-600 rounded-lg"
                  >
                    Começar grátis
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  );
}
