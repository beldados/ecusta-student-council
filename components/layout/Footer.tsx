import Image from "next/image";
import Link from "next/link";
import { Send } from "lucide-react";

interface FooterLink {
  href: string;
  label: string;
  external?: boolean;
}

interface FooterColumn {
  heading: string;
  links: FooterLink[];
}

const FOOTER_LINKS: FooterColumn[] = [
  {
    heading: "Student Council",
    links: [
      { href: "/about",       label: "About the Council" },
      { href: "/council",     label: "Council Directory" },
      { href: "/governance",  label: "Governance & Charter" },
      { href: "/initiatives", label: "Initiatives" },
      { href: "/mentorship",  label: "Mentorship Programme" },
      { href: "/clubs",       label: "Clubs & Organizations" },
    ],
  },
  {
    heading: "Student Life",
    links: [
      { href: "/events",         label: "Events & Calendar" },
      { href: "/announcements",  label: "Announcements" },
      { href: "/contact",        label: "Contact the Council" },
    ],
  },
  {
    heading: "University",
    links: [
      { href: "https://ecu.edu.et",            label: "ECUSTA Main Website", external: true },
      { href: "https://portal.ecu.edu.et",     label: "Student Portal", external: true },
      { href: "https://elearn.ecusta-hli.edu.et", label: "E-Learning (DLC)", external: true },
      { href: "https://portal.ecu.edu.et/helpdesk", label: "HelpDesk", external: true },
    ],
  },
];

const SOCIAL = [
  { href: "https://t.me/EcustaAtlas",       label: "Telegram", icon: <Send size={16} /> },
  {
    href: "https://www.instagram.com/ecusta.atlas",
    label: "Instagram",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="bg-[#0F1B33] text-white pt-14 pb-8 border-t-8 border-[#9B1B30] relative overflow-hidden">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, #D4AF37 0%, transparent 60%)" }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* ── Brand + Social Row ─────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 border-b border-white/10 pb-10 mb-10">
          <div className="flex items-center gap-4">
            <div className="bg-white p-1.5 rounded-xs shrink-0">
              <Image
                src="/images/ecusta-crest.png"
                alt="ECUSTA Official Crest"
                width={40}
                height={40}
                className="object-contain"
              />
            </div>
            <div>
              <h2 className="font-serif text-xl font-bold tracking-wide leading-tight">
                ECUSTA Student Council
              </h2>
              <p className="text-[#D4AF37] text-[10px] font-bold uppercase tracking-[0.2em] mt-0.5">
                Empowering · Serving · Leading
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {SOCIAL.map(({ href, label, icon }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="bg-white/10 hover:bg-[#D4AF37] hover:text-[#0F1B33] p-2.5 rounded-xs transition-colors text-white"
              >
                {icon}
              </a>
            ))}
            <a
              href="https://t.me/EcustaAtlasBot"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 px-3 py-2 bg-[#D4AF37] hover:bg-white text-[#0F1B33] text-[11px] font-bold uppercase tracking-wider rounded-xs transition-colors"
            >
              @EcustaAtlasBot ↗
            </a>
          </div>
        </div>

        {/* ── Link Columns ──────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-12">
          {FOOTER_LINKS.map(({ heading, links }) => (
            <div key={heading}>
              <h3 className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#D4AF37] mb-4">
                {heading}
              </h3>
              <ul className="space-y-2.5">
                {links.map(({ href, label, external }) => (
                  <li key={href}>
                    {external ? (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-serif text-sm text-slate-300 hover:text-[#D4AF37] transition-colors"
                      >
                        {label} ↗
                      </a>
                    ) : (
                      <Link
                        href={href}
                        className="font-serif text-sm text-slate-300 hover:text-[#D4AF37] transition-colors"
                      >
                        {label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Bottom Strip ──────────────────────────────────────────── */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex flex-wrap items-center gap-4">
            <span>© {new Date().getFullYear()} ECUSTA Student Council</span>
            <span className="hidden md:inline text-white/20">|</span>
            <Link href="/about" className="hover:text-white transition-colors">About</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
            <a href="https://ecu.edu.et" target="_blank" rel="noopener noreferrer" className="hover:text-[#D4AF37] transition-colors">
              ecu.edu.et ↗
            </a>
          </div>
          <p className="text-[11px] text-slate-500">
            Built by <span className="text-[#D4AF37]">Daniel Demerw</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
