import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Moment, MomentStatus } from "@/data/moments";
import { ChevronDown, ChevronUp } from "lucide-react";

interface MomentCardProps {
  moment: Moment;
  index: number;
}

export function MomentCard({ moment: initialMoment, index }: MomentCardProps) {
  const [moment, setMoment] = useState<Moment>(initialMoment);
  const [expanded, setExpanded] = useState(false);

  const handleAction = (action: string) => {
    let nextStatus: MomentStatus = moment.status;
    
    if (action === 'ESCALATE') nextStatus = 'ESCALATED';
    else if (action === 'ACCEPT') nextStatus = 'ACTIONED';
    else if (action === 'ASSIGN') nextStatus = 'IN_PROGRESS';
    else if (action === 'OVERRIDE') nextStatus = 'RESOLVED';
    else if (action === 'MONITOR') nextStatus = 'STABILISED';
    
    setMoment({ ...moment, status: nextStatus });
    if (nextStatus !== 'DETECTED' && nextStatus !== 'ESCALATED') {
      setExpanded(true);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DETECTED': return 'bg-amber-500/20 text-amber-500 border-amber-500/30';
      case 'ACTIONED': return 'bg-blue-500/20 text-blue-500 border-blue-500/30';
      case 'IN_PROGRESS': return 'bg-blue-400/20 text-blue-400 border-blue-400/30 animate-pulse';
      case 'STABILISED': return 'bg-emerald-500/20 text-emerald-500 border-emerald-500/30';
      case 'RESOLVED': return 'bg-emerald-500/10 text-emerald-500/70 border-emerald-500/20';
      case 'ESCALATED': return 'bg-red-500/20 text-red-500 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-500 border-gray-500/30';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    if (urgency === 'CRITICAL') return 'text-red-500';
    if (urgency === 'HIGH') return 'text-amber-500';
    return 'text-muted-foreground';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className={`bg-card border border-border p-6 relative overflow-hidden ${
        (moment.urgency === 'CRITICAL' && moment.status === 'DETECTED') ? 'ring-1 ring-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.15)]' : ''
      } ${
        (moment.status === 'DETECTED' && moment.urgency !== 'CRITICAL') ? 'ring-1 ring-primary/20' : ''
      }`}
    >
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-lg font-bold text-white mb-1">{moment.title}</h3>
          <p className="text-sm text-muted-foreground">{moment.whySurfaced}</p>
        </div>
        <div className={`px-2 py-1 text-[10px] font-bold tracking-widest uppercase border ${getStatusColor(moment.status)}`}>
          {moment.status}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-8 gap-y-4 mb-6">
        <div>
          <div className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Signals</div>
          <ul className="text-sm text-white space-y-1">
            {moment.signals.map((sig, i) => <li key={i}>• {sig}</li>)}
          </ul>
        </div>
        <div>
          <div className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Pattern Detected</div>
          <div className="text-sm text-white">{moment.patternDetected}</div>
        </div>
        
        <div>
          <div className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Intelligence</div>
          <div className="flex items-center gap-4 text-sm text-white">
            <span>Conf: {moment.confidence}%</span>
            <span className={getUrgencyColor(moment.urgency)}>Urg: {moment.urgency}</span>
          </div>
        </div>

        <div>
          <div className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Exposure</div>
          <div className="text-sm text-white">{moment.commercialExposure}</div>
        </div>

        <div className="col-span-2 mt-2">
          <div className="text-[10px] text-primary uppercase tracking-widest mb-1">Recommended Action</div>
          <div className="text-sm text-white border-l-2 border-primary pl-3 py-1 bg-white/5">
            {moment.recommendedAction}
          </div>
        </div>
      </div>

      {moment.status === 'DETECTED' && (
        <div className="flex gap-2 border-t border-border pt-4">
          <button onClick={() => handleAction('ACCEPT')} className="flex-1 bg-primary text-primary-foreground text-xs font-bold uppercase tracking-widest py-2 hover:bg-primary/90 transition-colors">
            Accept
          </button>
          <button onClick={() => handleAction('ASSIGN')} className="flex-1 bg-white/5 border border-border text-white text-xs font-bold uppercase tracking-widest py-2 hover:bg-white/10 transition-colors">
            Assign
          </button>
          <button onClick={() => handleAction('OVERRIDE')} className="flex-1 bg-white/5 border border-border text-white text-xs font-bold uppercase tracking-widest py-2 hover:bg-white/10 transition-colors">
            Override
          </button>
          <button onClick={() => handleAction('ESCALATE')} className="flex-1 bg-red-500/10 text-red-500 border border-red-500/20 text-xs font-bold uppercase tracking-widest py-2 hover:bg-red-500/20 transition-colors">
            Escalate
          </button>
        </div>
      )}

      {moment.status !== 'DETECTED' && (
        <div className="border-t border-border pt-4 mt-4">
          <button 
            onClick={() => setExpanded(!expanded)} 
            className="flex items-center justify-between w-full text-xs text-muted-foreground uppercase tracking-widest hover:text-white transition-colors"
          >
            <span>Execution Feedback</span>
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          <AnimatePresence>
            {expanded && moment.executionFeedback && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-4 grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-muted-foreground block mb-1">What Happened</span>
                    <span className="text-white">{moment.executionFeedback.whatHappened}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block mb-1">Team Assigned</span>
                    <span className="text-white">{moment.executionFeedback.teamAssigned}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block mb-1">Notified</span>
                    <span className="text-white">{moment.executionFeedback.whoNotified}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block mb-1">Response Time</span>
                    <span className="text-white">{moment.executionFeedback.responseTime}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-muted-foreground block mb-1">Outcome Delta</span>
                    <span className="text-emerald-500">{moment.executionFeedback.outcomeDelta}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}
