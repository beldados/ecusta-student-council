"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useCallback, useRef } from "react";
import { Moon, Sun, Menu, X, ChevronDown, ChevronRight, Search } from "lucide-react";

const NAV_LINKS = [
  { href: "/about",         label: "About" },
  { href: "/council",       label: "Council" },
  { href: "/initiatives",   label: "Initiatives" },
  { href: "/events",        label: "Events" },
  { href: "/announcements", label: "Announcements" },
  { href: "/clubs",         label: "Clubs" },
  { href: "/mentorship",    label: "Mentorship" },
  { href: "/contact",       label: "Contact" },
];

export default function Navbar() {
  const [isDark, setIsDark]                       = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen]   = useState(false);
  const [isScrolled, setIsScrolled]               = useState(false);
  const [searchQuery, setSearchQuery]             = useState("");
  const [showSearch, setShowSearch]               = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  // ── Init theme ──────────────────────────────────────────────────────────────
  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  // ── Scroll detection ────────────────────────────────────────────────────────
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ── Theme toggle ────────────────────────────────────────────────────────────
  const toggleTheme = () => {
    const dark = document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", dark ? "dark" : "light");
    setIsDark(dark);
  };

  // ── Mobile menu ─────────────────────────────────────────────────────────────
  const closeMenu = useCallback(() => setIsMobileMenuOpen(false), []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { closeMenu(); setShowSearch(false); }
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen, closeMenu]);

  // ── Search focus ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (showSearch) searchRef.current?.focus();
  }, [showSearch]);

  return (
    <>
      {/* ── Top Institutional Ribbon ─────────────────────────────────────── */}
      <div
        className={`hidden md:flex w-full bg-[#0F1B33] border-b border-[#D4AF37]/30 text-slate-400 text-[11px] font-medium items-center justify-between px-4 sm:px-6 lg:px-8 py-1.5 transition-all duration-300 ${
          isScrolled ? "h-0 py-0 opacity-0 overflow-hidden" : "h-auto opacity-100"
        }`}
      >
        <span className="flex items-center gap-1.5 text-slate-300">
          🏛️ Official Student Government of ECUSTA · School of Medicine
        </span>
        <div className="flex items-center gap-4">
          <a
            href="https://ecu.edu.et"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#D4AF37] transition-colors"
          >
            Main University (ecu.edu.et) ↗
          </a>
          <span className="text-slate-600">|</span>
          <a
            href="https://portal.ecu.edu.et"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#D4AF37] transition-colors"
          >
            Student Portal ↗
          </a>
          <span className="text-slate-600">|</span>
          <a
            href="https://t.me/EcustaAtlas"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#D4AF37] transition-colors"
          >
            Telegram ↗
          </a>
        </div>
      </div>

      {/* ── Main Sticky Header ───────────────────────────────────────────── */}
      <header
        className={`sticky top-0 z-50 w-full bg-[#FAF8F5] dark:bg-[#0A0A0A] border-b-2 border-[#1B2A4A] dark:border-stone-800 transition-all duration-300 ${
          isScrolled
            ? "shadow-lg bg-white/95 dark:bg-[#0A0A0A]/95 backdrop-blur-md"
            : ""
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`flex items-center justify-between transition-all duration-300 ${
              isScrolled ? "h-[4.5rem]" : "h-24"
            }`}
          >
            {/* ── Brand ────────────────────────────────────────────────── */}
            <Link
              href="/"
              onClick={closeMenu}
              className="flex items-center gap-3 group shrink-0"
            >
              <div
                className={`flex items-center justify-center transition-all duration-300 ${
                  isScrolled ? "w-10 h-10" : "w-12 h-12"
                }`}
              >
                <Image
                  src="/images/ecusta-crest.png"
                  alt="ECUSTA Official Crest"
                  width={48}
                  height={48}
                  className="object-contain group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="flex flex-col">
                <span
                  className={`font-serif font-bold text-[#1B2A4A] dark:text-white leading-none tracking-tight transition-all ${
                    isScrolled ? "text-xl" : "text-2xl"
                  }`}
                >
                  ECUSTA SC
                </span>
                <span className="text-[10px] uppercase tracking-[0.18em] font-bold text-[#9B1B30] dark:text-[#D4AF37] mt-0.5">
                  Student Council
                </span>
              </div>
            </Link>

            {/* ── Desktop Nav ──────────────────────────────────────────── */}
            <nav className="hidden lg:flex items-center h-full gap-0.5 xl:gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-2.5 xl:px-3 h-full flex items-center text-[12px] xl:text-[13px] font-bold tracking-[0.04em] uppercase text-stone-800 dark:text-stone-100 hover:text-[#9B1B30] dark:hover:text-[#D4AF37] border-b-2 border-transparent hover:border-[#D4AF37] transition-all duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* ── Right Actions ─────────────────────────────────────────── */}
            <div className="flex items-center gap-2">
              {/* Search */}
              {showSearch ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setShowSearch(false);
                  }}
                  className="hidden md:flex items-center gap-1.5 border border-stone-300 dark:border-stone-700 rounded-xs px-3 py-1.5 bg-white dark:bg-[#111]"
                >
                  <input
                    ref={searchRef}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search council…"
                    className="text-xs outline-none bg-transparent text-stone-800 dark:text-stone-100 w-40"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSearch(false)}
                    className="text-stone-400 hover:text-stone-600"
                  >
                    <X size={14} />
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setShowSearch(true)}
                  className="hidden md:flex p-2 text-stone-700 dark:text-stone-300 hover:text-[#9B1B30] dark:hover:text-[#D4AF37] transition-colors"
                  aria-label="Search"
                >
                  <Search size={18} />
                </button>
              )}

              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300 transition-colors cursor-pointer"
                aria-label="Toggle theme"
              >
                {isDark ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              {/* Desktop CTA */}
              <Link
                href="/contact"
                className="hidden md:inline-flex items-center px-4 py-2 bg-[#9B1B30] hover:bg-[#1B2A4A] text-white text-[11px] font-bold uppercase tracking-[0.1em] border-2 border-[#D4AF37] rounded-xs shadow-md transition-all duration-200 whitespace-nowrap"
              >
                Get in Touch
              </Link>

              {/* Mobile hamburger */}
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMobileMenuOpen}
                className="p-2 rounded-xs bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-white hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors lg:hidden cursor-pointer"
              >
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* ── Mobile Drawer ─────────────────────────────────────────────── */}
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 top-[4.5rem] bg-black/60 backdrop-blur-sm z-40 lg:hidden"
              onClick={closeMenu}
              aria-hidden="true"
            />

            {/* Panel */}
            <div className="absolute top-full left-0 right-0 bg-white dark:bg-[#0A0A0A] border-b-2 border-[#1B2A4A] dark:border-stone-800 shadow-2xl z-50 lg:hidden p-4 flex flex-col gap-2">
              <nav className="flex flex-col gap-1">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeMenu}
                    className="flex items-center justify-between px-4 py-3 text-sm font-bold uppercase tracking-wide text-stone-700 dark:text-stone-200 hover:text-[#9B1B30] dark:hover:text-[#D4AF37] hover:bg-stone-50 dark:hover:bg-stone-900 border-b border-stone-100 dark:border-stone-800 last:border-0 transition-all"
                  >
                    <span>{link.label}</span>
                    <ChevronRight size={14} className="text-stone-400" />
                  </Link>
                ))}
              </nav>

              {/* Official links */}
              <div className="pt-3 mt-2 border-t border-stone-100 dark:border-stone-800 space-y-1.5">
                <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 px-3 mb-2">
                  Official Links
                </p>
                {[
                  { href: "https://ecu.edu.et", label: "Main University (ecu.edu.et)" },
                  { href: "https://portal.ecu.edu.et", label: "Student Academic Portal" },
                  { href: "https://t.me/EcustaAtlas", label: "Telegram Channel" },
                ].map(({ href, label }) => (
                  <a
                    key={href}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between px-3 py-2 rounded-xs text-xs font-medium text-stone-500 dark:text-stone-400 hover:text-[#D4AF37] hover:bg-stone-50 dark:hover:bg-stone-900 transition-colors"
                  >
                    <span>{label}</span>
                    <span className="text-stone-300">↗</span>
                  </a>
                ))}
              </div>

              {/* Mobile CTA */}
              <div className="pt-3 border-t border-stone-100 dark:border-stone-800">
                <Link
                  href="/contact"
                  onClick={closeMenu}
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#9B1B30] hover:bg-[#1B2A4A] text-white text-xs font-bold uppercase tracking-wider border-2 border-[#D4AF37] rounded-xs shadow-md transition-all"
                >
                  Get in Touch
                </Link>
              </div>
            </div>
          </>
        )}
      </header>
    </>
  );
}
