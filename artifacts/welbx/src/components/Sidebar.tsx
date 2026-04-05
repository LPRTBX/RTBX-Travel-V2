import { Link, useLocation } from "wouter";

export function Sidebar() {
  const [location] = useLocation();

  const navItems = [
    { label: "LIVE MOMENTS", path: "/live-moments" },
    { label: "SYSTEM STATE", path: "/system-state" },
    { label: "OUTCOME INTELLIGENCE", path: "/outcome-intelligence" },
    { label: "SCENARIO DEMO", path: "/scenario-demo" },
  ];

  return (
    <aside className="fixed inset-y-0 left-0 w-64 bg-background border-r border-border flex flex-col z-50">
      <div className="p-8">
        <h1 className="text-2xl font-bold tracking-widest text-white uppercase">WELBX</h1>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => {
          const isActive = location === item.path || (location === "/" && item.path === "/live-moments");
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`block px-4 py-3 text-xs tracking-wide uppercase transition-colors ${
                isActive 
                  ? "text-primary font-bold border-l-2 border-primary pl-3 bg-white/5" 
                  : "text-muted-foreground hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-8 border-t border-border">
        <p className="text-[10px] text-muted-foreground tracking-widest uppercase">BXOS · Nexus · Vector</p>
      </div>
    </aside>
  );
}
