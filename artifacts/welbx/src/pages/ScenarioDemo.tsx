import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { AlertTriangle, Clock, ShieldAlert, Users, TrendingDown, CheckCircle2 } from "lucide-react";

export default function ScenarioDemo() {
  const [step, setStep] = useState(0);

  const next = () => setStep(s => s + 1);

  return (
    <div className="min-h-screen bg-background pl-64 text-foreground flex flex-col relative overflow-hidden">
      
      {/* Background visual noise / texture */}
      <div className="absolute inset-0 pointer-events-none opacity-5 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent mix-blend-overlay"></div>

      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div 
            key="s0"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center p-12 text-center max-w-4xl mx-auto"
          >
            <div className="text-[10px] text-muted-foreground tracking-widest uppercase mb-8">The Moment Most Systems Miss</div>
            <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-8">
              Peak check-in. Queue pressure is rising. A VIP guest has arrived. One room is not ready. Staff capacity is tightening. Sentiment is starting to fall.
            </h1>
            <p className="text-primary tracking-widest uppercase text-sm mb-12 font-bold">
              WELBX detected a compounding arrival risk.
            </p>
            <button onClick={next} className="bg-white text-black px-8 py-4 text-sm font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors">
              See How
            </button>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div 
            key="s1"
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            className="flex-1 p-12 max-w-3xl mx-auto w-full pt-32"
          >
            <h2 className="text-2xl font-bold mb-12 tracking-wide text-center">SIGNALS ARE STACKING</h2>
            <div className="space-y-4">
              {[
                { icon: Clock, text: "Queue wait time exceeded threshold", type: "warning" },
                { icon: AlertTriangle, text: "VIP arrival logged — 12 minutes out", type: "warning" },
                { icon: ShieldAlert, text: "Priority room not released", type: "critical" },
                { icon: Users, text: "Front desk capacity constrained", type: "warning" },
                { icon: TrendingDown, text: "Negative sentiment cues rising", type: "warning" },
              ].map((sig, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.4 }}
                  key={i}
                  className={`flex items-center gap-6 p-4 border bg-card ${sig.type === 'critical' ? 'border-red-500/30 text-red-500' : 'border-amber-500/30 text-amber-500'}`}
                >
                  <sig.icon size={20} />
                  <span className="font-mono text-sm tracking-wide">{sig.text}</span>
                </motion.div>
              ))}
            </div>
            <div className="mt-12 text-center">
              <button onClick={next} className="bg-white/10 text-white border border-white/20 px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-white/20 transition-colors">
                Continue
              </button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div 
            key="s2"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex-1 flex items-center justify-center p-12"
          >
            <div className="max-w-2xl w-full">
              <div className="text-[10px] text-primary tracking-widest uppercase mb-4">BXOS Engine Active</div>
              <h2 className="text-3xl font-bold mb-8 tracking-wide">BXOS DETECTED A COMPOUNDING MOMENT</h2>
              
              <div className="bg-card border border-border p-8 relative overflow-hidden ring-1 ring-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.1)]">
                <p className="text-xl mb-8 leading-relaxed">
                  Arrival risk across service flow, room readiness, guest value, and staff capacity — all converging in the next 12 minutes.
                </p>
                <div className="flex items-center gap-8 text-sm font-mono">
                  <div>
                    <span className="text-muted-foreground block mb-1">CONFIDENCE</span>
                    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-2xl text-white">94%</motion.span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block mb-1">RISK LEVEL</span>
                    <span className="text-2xl text-red-500">CRITICAL</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block mb-1">TIMESTAMP</span>
                    <span className="text-2xl text-white">14:32:07</span>
                  </div>
                </div>
              </div>

              <div className="mt-12">
                <button onClick={next} className="bg-white/10 text-white border border-white/20 px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-white/20 transition-colors">
                  Continue
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div 
            key="s3"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex-1 p-12 max-w-3xl mx-auto w-full pt-32"
          >
            <div className="text-[10px] text-primary tracking-widest uppercase mb-4 text-center">Nexus Engine Active</div>
            <h2 className="text-2xl font-bold mb-12 tracking-wide text-center">NEXUS MAPPED THE RESPONSE</h2>
            <div className="space-y-3">
              {[
                { text: "Open secondary check-in", detail: "Assigns host capacity" },
                { text: "Reallocate nearest available host", detail: "Nexus routing" },
                { text: "Prioritise housekeeping release — Room 847", detail: "Vector execution" },
                { text: "Trigger service recovery gesture", detail: "Loyalty protection" },
                { text: "Protect loyalty value", detail: "VIP protocol" },
              ].map((rec, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.2 }}
                  key={i}
                  className="flex items-center justify-between p-5 border border-white/10 bg-white/5"
                >
                  <span className="font-bold text-white tracking-wide">{rec.text}</span>
                  <span className="text-xs font-mono text-primary uppercase tracking-widest">{rec.detail}</span>
                </motion.div>
              ))}
            </div>
            <div className="mt-12 text-center">
              <button onClick={next} className="bg-white/10 text-white border border-white/20 px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-white/20 transition-colors">
                Continue
              </button>
            </div>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div 
            key="s4"
            initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center p-12 text-center"
          >
            <h2 className="text-4xl font-bold mb-16 tracking-wide">WHAT HAPPENS NEXT IS YOUR DECISION</h2>
            
            <div className="flex gap-6 mb-12 w-full max-w-4xl">
              <button onClick={next} className="flex-1 bg-primary text-primary-foreground py-8 text-xl font-bold uppercase tracking-widest hover:bg-primary/90 transition-transform hover:scale-105 active:scale-95">
                Accept All
              </button>
              <button className="flex-1 bg-transparent border border-white/20 text-white py-8 text-xl font-bold uppercase tracking-widest hover:bg-white/5 transition-colors">
                Override
              </button>
              <button className="flex-1 bg-red-500/10 border border-red-500/30 text-red-500 py-8 text-xl font-bold uppercase tracking-widest hover:bg-red-500/20 transition-colors">
                Escalate
              </button>
            </div>

            <div className="font-mono text-muted-foreground text-sm flex items-center gap-3">
              <span className="animate-pulse w-2 h-2 rounded-full bg-amber-500"></span>
              Auto-execution in 4:00
            </div>
          </motion.div>
        )}

        {step === 5 && (
          <motion.div 
            key="s5"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex-1 p-12 max-w-3xl mx-auto w-full pt-32"
          >
            <div className="text-[10px] text-primary tracking-widest uppercase mb-4 text-center">Vector Engine Active</div>
            <h2 className="text-2xl font-bold mb-12 tracking-wide text-center">VECTOR IS EXECUTING</h2>
            <div className="space-y-6 relative before:absolute before:inset-y-0 before:left-[19px] before:w-px before:bg-white/10">
              {[
                { text: "Front desk lead notified", time: "00:00:12" },
                { text: "Host reassigned", time: "00:00:31" },
                { text: "Housekeeping priority pushed to Room 847", time: "00:01:04" },
                { text: "VIP welcome and recovery flow activated", time: "00:01:47" },
              ].map((step, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.8 }}
                  key={i}
                  className="flex items-center gap-6 relative z-10"
                >
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-500">
                    <CheckCircle2 size={20} />
                  </div>
                  <div className="flex-1 bg-card border border-border p-4 flex justify-between items-center">
                    <span className="font-bold text-white">{step.text}</span>
                    <span className="text-xs font-mono text-muted-foreground">{step.time}</span>
                  </div>
                </motion.div>
              ))}
            </div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3.5 }} className="mt-12 text-center">
              <button onClick={next} className="bg-white/10 text-white border border-white/20 px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-white/20 transition-colors">
                Continue
              </button>
            </motion.div>
          </motion.div>
        )}

        {step === 6 && (
          <motion.div 
            key="s6"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex-1 flex items-center justify-center p-12"
          >
            <div className="max-w-4xl w-full">
              <h2 className="text-3xl font-bold mb-12 tracking-wide text-center">OUTCOME CONFIRMED</h2>
              
              <div className="grid grid-cols-2 gap-8 mb-12">
                <div className="bg-card border border-border p-8">
                  <h3 className="text-xs text-muted-foreground tracking-widest uppercase mb-6 pb-2 border-b border-border">Before Intervention</h3>
                  <ul className="space-y-4 text-sm text-red-500 font-mono">
                    <li>[CRIT] Queue pressure HIGH</li>
                    <li>[CRIT] Room not ready</li>
                    <li>[WARN] VIP at risk</li>
                    <li>[WARN] Sentiment declining</li>
                  </ul>
                </div>
                <div className="bg-card border border-border p-8 ring-1 ring-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                  <h3 className="text-xs text-emerald-500 tracking-widest uppercase mb-6 pb-2 border-b border-emerald-500/30">After Intervention</h3>
                  <ul className="space-y-4 text-sm text-white font-mono">
                    <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-500"/> Queue resolved</li>
                    <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-500"/> Room released</li>
                    <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-500"/> VIP handled</li>
                    <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-500"/> Sentiment stabilised</li>
                  </ul>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 p-6 flex justify-between items-center text-center">
                <div>
                  <div className="text-[10px] text-muted-foreground tracking-widest uppercase mb-1">Value Protected</div>
                  <div className="text-xl font-bold text-primary">£8,000+</div>
                </div>
                <div>
                  <div className="text-[10px] text-muted-foreground tracking-widest uppercase mb-1">System Action</div>
                  <div className="text-xl font-bold text-emerald-500">Service Failure Avoided</div>
                </div>
                <div>
                  <div className="text-[10px] text-muted-foreground tracking-widest uppercase mb-1">Response Time</div>
                  <div className="text-xl font-bold text-white">1m 47s</div>
                </div>
                <div>
                  <div className="text-[10px] text-muted-foreground tracking-widest uppercase mb-1">NPS Delta</div>
                  <div className="text-xl font-bold text-white">+22pts est.</div>
                </div>
              </div>

              <div className="mt-12 text-center">
                <button onClick={next} className="bg-white/10 text-white border border-white/20 px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-white/20 transition-colors">
                  Finish
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {step === 7 && (
          <motion.div 
            key="s7"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center p-12 text-center"
          >
            <h2 className="text-3xl md:text-5xl font-bold leading-tight mb-4">
              This is not reporting.
            </h2>
            <h2 className="text-2xl md:text-4xl text-muted-foreground font-light mb-16 max-w-4xl leading-tight">
              This is operational intelligence turning signals into controlled outcomes in real time.
            </h2>
            
            <div className="text-sm tracking-widest font-mono text-primary mb-16 flex items-center justify-center gap-4 uppercase">
              <span>Detect</span> <span>→</span>
              <span>Decide</span> <span>→</span>
              <span>Route</span> <span>→</span>
              <span>Execute</span> <span>→</span>
              <span>Outcome</span>
            </div>

            <Link href="/live-moments" className="bg-white text-black px-12 py-5 text-sm font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors">
              See it live
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
