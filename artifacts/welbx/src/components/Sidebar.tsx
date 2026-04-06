import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";

const navItems = [
  { label: "Live Moments", path: "/live-moments", sub: "6 ACTIVE" },
  { label: "System State", path: "/system-state", sub: "ELEVATED" },
  { label: "Outcome Intelligence", path: "/outcome-intelligence", sub: "TODAY" },
  { label: "Scenario Demo", path: "/scenario-demo", sub: "DEMO" },
];

export function Sidebar() {
  const [location] = useLocation();

  return (
    <aside className="fixed inset-y-0 left-0 w-56 flex flex-col z-50" style={{ background: 'hsl(220 13% 4%)', borderRight: '1px solid hsl(220 13% 9%)' }}>
      
      {/* Wordmark */}
      <div className="px-7 pt-8 pb-6 border-b" style={{ borderColor: 'hsl(220 13% 9%)' }}>
        <div className="text-white font-bold tracking-[0.25em] text-sm uppercase mb-1">WELBX</div>
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
      <nav className="flex-1 pt-3 pb-4">
        {navItems.map((item, i) => {
          const isActive = location === item.path || (location === "/" && item.path === "/live-moments");
          return (
            <Link key={item.path} href={item.path}>
              <div className={`relative px-7 py-3.5 cursor-pointer group transition-all duration-150 ${isActive ? '' : 'hover:bg-white/[0.03]'}`}>
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute left-0 inset-y-0 w-px"
                    style={{ background: 'hsl(var(--primary))' }}
                  />
                )}
                <div className={`text-xs font-semibold tracking-wide transition-colors ${
                  isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-300'
                }`}>
                  {item.label}
                </div>
                <div style={{ fontSize: 9, letterSpacing: '0.1em', marginTop: 2, fontWeight: 600, color: isActive ? 'hsl(43 68% 55%)' : 'hsl(215 16% 32%)' }}>
                  {item.sub}
                </div>
              </div>
            </Link>
          );
        })}
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
