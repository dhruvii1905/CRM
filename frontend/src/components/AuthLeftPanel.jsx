import { useEffect, useState } from 'react';

const services = [
  'Tender Bidding & Consultancy',
  'GeM Portal Registration',
  'ISO & MSME Certification',
  'Compliance Solutions',
];

export default function AuthLeftPanel() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="hidden lg:flex w-1/2 bg-black text-white flex-col justify-center px-16 relative overflow-hidden">

      {/* Dot grid */}
      <div className="absolute inset-0 opacity-5"
        style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

      {/* Floating orbs */}
      <div className="absolute top-16 right-16 w-40 h-40 rounded-full bg-white/5 animate-pulse" style={{ animationDuration: '4s' }} />
      <div className="absolute bottom-24 left-8 w-24 h-24 rounded-full bg-white/5 animate-pulse" style={{ animationDuration: '6s', animationDelay: '1s' }} />
      <div className="absolute top-1/2 right-8 w-16 h-16 rounded-full bg-white/5 animate-pulse" style={{ animationDuration: '5s', animationDelay: '2s' }} />

      <div className="relative z-10">
        {/* Logo + title */}
        <div
          className="flex items-center gap-3 mb-6 transition-all duration-700"
          style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(-24px)' }}
        >
          <span
            className="text-5xl"
            style={{ display: 'inline-block', animation: 'floatIcon 3s ease-in-out infinite' }}
          >🏢</span>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Orical Technology</h1>
            <p className="text-white/50 text-sm font-light">LLP — Ahmedabad, Est. 2022</p>
          </div>
        </div>

        {/* Divider */}
        <div
          className="h-px bg-white/10 mb-6 transition-all duration-700 delay-300"
          style={{ opacity: visible ? 1 : 0, transform: visible ? 'scaleX(1)' : 'scaleX(0)', transformOrigin: 'left' }}
        />

        {/* Service items */}
        <div className="space-y-3">
          {services.map((s, i) => (
            <div
              key={i}
              className="flex items-center gap-3 text-white/60 text-sm font-light transition-all duration-500"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateX(0)' : 'translateX(-20px)',
                transitionDelay: `${400 + i * 120}ms`,
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full bg-white/40 flex-shrink-0"
                style={{ animation: `pulse 2s ease-in-out infinite`, animationDelay: `${i * 0.4}s` }}
              />
              {s}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes floatIcon {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  );
}
