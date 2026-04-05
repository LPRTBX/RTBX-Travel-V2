import { SEEDED_MOMENTS } from "@/data/moments";
import { MomentCard } from "@/components/MomentCard";

export default function LiveMoments() {
  return (
    <div className="min-h-screen bg-background pl-64 text-foreground">
      <div className="p-8 max-w-5xl mx-auto">
        <header className="mb-12">
          <h2 className="text-3xl font-bold tracking-wide mb-2">LIVE MOMENTS</h2>
          <p className="text-muted-foreground">Real-time operational signals and interventions.</p>
        </header>

        <div className="space-y-6">
          {SEEDED_MOMENTS.map((moment, i) => (
            <MomentCard key={moment.id} moment={moment} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
