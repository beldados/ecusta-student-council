export default function MedicalBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden select-none -z-10 opacity-[0.07] dark:opacity-[0.12]">
      <svg
        className="w-full h-full"
        viewBox="0 0 1200 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M0 200 H300 L320 185 L340 215 L360 200 H420 L435 150 L450 270 L465 110 L480 240 L495 190 L510 205 L525 200 H600 L630 170 L660 200 H800 L815 150 L830 270 L845 110 L860 240 L875 190 L890 205 L905 200 H1200"
          stroke="url(#pulse-gradient)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="animate-pulse-slow"
        />
        <defs>
          <linearGradient id="pulse-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1B2A4A" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#D4AF37" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#1B2A4A" stopOpacity="0.2" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
