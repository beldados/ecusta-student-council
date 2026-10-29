"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useCallback } from "react";
import { Moon, Sun, Menu, X, ChevronRight, ArrowRight } from "lucide-react";

export default function Navbar() {
  const [isDark, setIsDark] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggleTheme = () => {
    const isDarkMode = document.documentElement.classList.contains("dark");
    if (isDarkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDark(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDark(true);
    }
  };

  const closeMenu = useCallback(() => setIsMobileMenuOpen(false), []);

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu();
    };
    if (isMobileMenuOpen) {
      document.addEventListener("keydown", handleKey);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen, closeMenu]);

  const NAV_LINKS = [
    { href: "/about", label: "About" },
    { href: "/council", label: "Council" },
    { href: "/events", label: "Events" },
    { href: "/announcements", label: "Announcements" },
    { href: "/clubs", label: "Clubs" },
    { href: "/contact", label: "Contact" },
  ];
  const navLinks = NAV_LINKS;

  return (
    <>
      {/* Top Institutional Ribbon - Desktop Only */}
      <div className="hidden md:flex w-full bg-[#0A1324] border-b border-[#1E2D4D] text-slate-400 py-1.5 px-4 sm:px-6 lg:px-8 text-xs font-medium items-center justify-between">
        <span className="flex items-center gap-1.5 text-slate-300">
          🏛️ Official Student Government of ECUSTA • School of Medicine
        </span>
        <div className="flex items-center gap-3">
          <a href="https://ecu.edu.et" target="_blank" rel="noopener noreferrer" className="hover:text-[#D4AF37] transition-colors">
            Main University (ecu.edu.et) ↗
          </a>
          <span className="text-slate-600">|</span>
          <a href="https://portal.ecu.edu.et" target="_blank" rel="noopener noreferrer" className="hover:text-[#D4AF37] transition-colors">
            Student Portal (portal.ecu.edu.et) ↗
          </a>
        </div>
      </div>

      <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur-md border-b border-border transition-colors">
      <div className="container mx-auto flex items-center justify-between px-4 sm:px-6 py-3 sm:py-3.5">
        
        {/* Brand (Left) */}
        <Link href="/" onClick={closeMenu} className="flex items-center gap-2.5 group">
          {/* Official University Crest */}
          <Image
            src="/images/ecusta-crest.png"
            alt="ECUSTA Official Crest"
            width={36}
            height={36}
            className="rounded-full object-contain shrink-0"
          />
          <div className="h-6 w-[1px] bg-slate-700/80 mx-0.5 hidden sm:block" />
          {/* Atlas / SC Badge */}
          <Image
            src="/images/initiatives/ecusta-atlas.jpg"
            alt="ECUSTA Atlas"
            width={32}
            height={32}
            className="rounded-md object-contain bg-black border border-slate-700 shrink-0"
          />
          <div className="flex flex-col">
            <span className="font-bold text-sm leading-tight text-slate-900 dark:text-white tracking-tight">
              ECUSTA SC
            </span>
            <span className="text-[10px] text-[#D4AF37] font-semibold uppercase tracking-wider">
              Student Council
            </span>
          </div>
        </Link>
        
        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-7">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-text-secondary hover:text-[#D4AF37] transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        
        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-surface-hover text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          
          {/* Desktop "Get in Touch" CTA */}
          <Link
            href="/contact"
            className="hidden md:inline-flex text-xs sm:text-sm font-semibold tracking-wide uppercase px-5 py-2.5 rounded-lg shadow-sm transition-all bg-[#D4AF37] hover:bg-[#C5A028] text-[#0F1B33]"
          >
            Get in Touch
          </Link>

          {/* Mobile Hamburger Menu Button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open navigation menu"}
            aria-expanded={isMobileMenuOpen}
            className="p-2 rounded-xl bg-surface border border-border text-text-primary hover:bg-surface-hover transition-colors md:hidden cursor-pointer"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

      </div>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 top-[57px] sm:top-[61px] bg-black/60 backdrop-blur-sm z-40 md:hidden animate-in fade-in-0 duration-200"
            onClick={closeMenu}
            aria-hidden="true"
          />

          {/* Slide-down Menu Panel */}
          <div className="absolute top-full left-0 right-0 bg-surface/98 dark:bg-[#121D33]/98 backdrop-blur-xl border-b border-border shadow-2xl z-50 md:hidden animate-in slide-in-from-top-2 duration-200 p-4 sm:p-5 flex flex-col gap-2">
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMenu}
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-all"
                >
                  <span>{link.label}</span>
                  <ChevronRight size={15} className="text-text-secondary/40" />
                </Link>
              ))}
            </nav>

            <div className="pt-3 mt-3 border-t border-slate-800 space-y-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 px-3">
                Official University Links
              </p>
              <a
                href="https://ecu.edu.et"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium text-slate-300 hover:text-[#D4AF37] hover:bg-slate-800"
              >
                <span>Main University (ecu.edu.et)</span>
                <span>↗</span>
              </a>
              <a
                href="https://portal.ecu.edu.et"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium text-slate-300 hover:text-[#D4AF37] hover:bg-slate-800"
              >
                <span>Student Academic Portal</span>
                <span>↗</span>
              </a>
            </div>

            <div className="pt-3 mt-1 border-t border-border flex flex-col gap-2.5">
              <Link
                href="/contact"
                onClick={closeMenu}
                className="w-full text-xs sm:text-sm font-semibold tracking-wide uppercase px-5 py-2.5 rounded-lg shadow-sm transition-all bg-[#D4AF37] hover:bg-[#C5A028] text-[#0F1B33] inline-flex items-center justify-center gap-1.5"
              >
                <span>Get in Touch</span>
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </>
      )}
    </header>
    </>
  );
}

