import Image from "next/image";

export default function Footer() {
  return (
    <footer className="w-full border-t border-[#1E2D4D] bg-[#0F1B33] text-slate-400 py-6 px-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <Image
            src="/images/ecusta-crest.png"
            alt="ECUSTA Official Crest"
            width={32}
            height={32}
            className="rounded-full object-contain shrink-0"
          />
          <div className="h-5 w-[1px] bg-slate-700/80 mx-0.5" />
          <Image
            src="/images/initiatives/ecusta-atlas.jpg"
            alt="ECUSTA Atlas"
            width={28}
            height={28}
            className="rounded object-contain bg-black border border-[#1E2D4D] shrink-0"
          />
          <span className="font-semibold text-white text-sm">ECUSTA Student Council</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <a href="https://t.me/EcustaAtlas" target="_blank" rel="noopener noreferrer" className="px-2.5 py-1 rounded bg-[#121D33] border border-[#1E2D4D] text-slate-300 hover:text-[#D4AF37] transition-colors">Telegram ↗</a>
          <a href="https://t.me/EcustaAtlasBot" target="_blank" rel="noopener noreferrer" className="px-2.5 py-1 rounded bg-[#1B2A4A] border border-[#1E2D4D] text-[#D4AF37] hover:text-[#C5A028] transition-colors">@EcustaAtlasBot ↗</a>
          <a href="https://www.instagram.com/ecusta.atlas" target="_blank" rel="noopener noreferrer" className="px-2.5 py-1 rounded bg-[#121D33] border border-[#1E2D4D] text-slate-300 hover:text-[#D4AF37] transition-colors">Instagram ↗</a>
        </div>
        <p className="text-xs text-slate-400">
          © 2026 ECUSTA SC • Built by <span className="text-[#D4AF37]">Daniel Demerw</span>
        </p>
      </div>
    </footer>
  );
}
