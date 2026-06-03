import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";

const navItems = [
  { label: "Command Centre", path: "/command-centre", sub: "LIVE" },
  { label: "Signal Intelligence", path: "/signal-intelligence", sub: "SOURCES" },
  { label: "Live Moments", path: "/live-moments", sub: "6 ACTIVE" },
  { label: "System State", path: "/system-state", sub: "ELEVATED" },
  { label: "Outcome Intelligence", path: "/outcome-intelligence", sub: "TODAY" },
  { label: "Scenario Demo", path: "/scenario-demo", sub: "DEMO" },
  { label: "Guest Layer", path: "/guest-layer", sub: "ENGAGEMENT" },
];

const heroNavItems = [
  { label: "Live Demo", path: "/demo", sub: "GUIDED", accent: "#c9a84c" },
  { label: "Comparison", path: "/compare", sub: "PROOF", accent: undefined },
  { label: "Command Mode", path: "/command-mode", sub: "CRITICAL", accent: "#ef4444" },
];

export function Sidebar() {
  const [location] = useLocation();

  return (
    <aside className="fixed inset-y-0 left-0 w-56 flex flex-col z-50" style={{ background: 'hsl(220 13% 4%)', borderRight: '1px solid hsl(220 13% 9%)' }}>

      {/* Wordmark */}
      <div className="px-7 pt-8 pb-6 border-b" style={{ borderColor: 'hsl(220 13% 9%)' }}>
        <Link href="/">
          <div style={{ cursor: 'pointer' }}>
            <div className="text-white font-bold tracking-[0.25em] text-sm uppercase mb-1">WELBX</div>
          </div>
        </Link>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" style={{ animation: 'pulse-amber 2s ease-in-out infinite' }} />
          <span style={{ fontSize: 9, letterSpacing: '0.12em', color: 'hsl(215 16% 38%)', textTransform: 'uppercase', fontWeight: 600 }}>
            SYSTEM ACTIVE
          </span>
        </div>
        <div style={{ fontSize: 9, letterSpacing: '0.06em', color: 'hsl(215 16% 24%)', lineHeight: 1.4 }}>
          The Grand Meridian
        </div>
        <div style={{ fontSize: 8, letterSpacing: '0.1em', color: 'hsl(215 16% 20%)', textTransform: 'uppercase' }}>
          London
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 pt-3 pb-4 flex flex-col overflow-y-auto">
        <div>
          {navItems.map((item) => {
            const isActive = location === item.path;
            return (
              <Link key={item.path} href={item.path}>
                <div className={`relative px-7 py-3 cursor-pointer group transition-all duration-150 ${isActive ? '' : 'hover:bg-white/[0.03]'}`}>
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute left-0 inset-y-0 w-px"
                      style={{ background: 'hsl(var(--primary))' }}
                    />
                  )}
                  <div className={`text-xs font-semibold tracking-wide transition-colors ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-300'}`}>
                    {item.label}
                  </div>
                  <div style={{ fontSize: 9, letterSpacing: '0.1em', marginTop: 2, fontWeight: 600, color: isActive ? 'hsl(43 68% 55%)' : 'hsl(215 16% 32%)' }}>
                    {item.sub}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Hero separator */}
        <div style={{ margin: '10px 28px 6px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ flex: 1, height: 1, background: 'hsl(220 13% 9%)' }} />
          <span style={{ fontSize: 7, letterSpacing: '0.16em', color: 'hsl(215 16% 20%)', textTransform: 'uppercase', fontWeight: 700, flexShrink: 0 }}>Hero</span>
          <div style={{ flex: 1, height: 1, background: 'hsl(220 13% 9%)' }} />
        </div>

        <div>
          {heroNavItems.map((item) => {
            const isActive = location === item.path;
            const subColor = item.accent ?? 'hsl(43 68% 55%)';
            return (
              <Link key={item.path} href={item.path}>
                <div className={`relative px-7 py-3 cursor-pointer group transition-all duration-150 ${isActive ? '' : 'hover:bg-white/[0.03]'}`}>
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute left-0 inset-y-0 w-px"
                      style={{ background: item.accent ?? 'hsl(var(--primary))' }}
                    />
                  )}
                  <div className={`text-xs font-semibold tracking-wide transition-colors ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-300'}`}>
                    {item.label}
                  </div>
                  <div style={{ fontSize: 9, letterSpacing: '0.1em', marginTop: 2, fontWeight: 600, color: isActive ? subColor : 'hsl(215 16% 28%)' }}>
                    {item.sub}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer engine credits */}
      <div className="px-7 py-5 border-t" style={{ borderColor: 'hsl(220 13% 9%)' }}>
        <div style={{ fontSize: 8, letterSpacing: '0.16em', color: 'hsl(215 16% 24%)', textTransform: 'uppercase', marginBottom: 8 }}>
          Engines
        </div>
        {[
          { name: 'BXOS', desc: 'Intelligence' },
          { name: 'Nexus', desc: 'Routing' },
          { name: 'Vector', desc: 'Execution' },
        ].map(e => (
          <div key={e.name} style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', padding: '3px 0' }}>
            <span style={{ fontSize: 9, letterSpacing: '0.12em', color: 'hsl(215 16% 30%)', textTransform: 'uppercase', fontWeight: 600 }}>{e.name}</span>
            <span style={{ fontSize: 8, letterSpacing: '0.08em', color: 'hsl(215 16% 22%)', textTransform: 'uppercase' }}>{e.desc}</span>
          </div>
        ))}
      </div>
    </aside>
  );
}
