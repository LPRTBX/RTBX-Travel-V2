import { useState } from "react";
import { PartnerRoomLayout } from "@/components/PartnerRoomLayout";

interface SliderInputProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
  onChange: (v: number) => void;
  color?: string;
}

function SliderInput({ label, value, min, max, step, format, onChange, color = "#c9a84c" }: SliderInputProps) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
        <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.06em", color: "rgba(255,255,255,0.6)" }}>{label}</div>
        <div style={{ fontSize: 14, fontWeight: 800, color: color }}>{format(value)}</div>
      </div>
      <div style={{ position: "relative", height: 4, background: "rgba(255,255,255,0.08)", cursor: "pointer" }}>
        <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${((value - min) / (max - min)) * 100}%`, background: color, transition: "width 0.1s" }} />
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        style={{ width: "100%", marginTop: -4, opacity: 0, position: "relative", cursor: "pointer", height: 12 }}
      />
    </div>
  );
}

function OutputCard({ label, value, sub, color }: { label: string; value: string; sub?: string; color: string }) {
  return (
    <div style={{ padding: "22px 20px", background: `${color}06`, border: `1px solid ${color}25`, borderTop: `2px solid ${color}` }}>
      <div style={{ fontSize: 8, letterSpacing: "0.16em", color: color, textTransform: "uppercase", fontWeight: 700, marginBottom: 10 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", letterSpacing: "-0.01em" }}>{value}</div>
      {sub && <div style={{ fontSize: 10, color: "rgba(255,255,255,0.28)", marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

export default function PartnerProofCalculator() {
  const [rooms, setRooms] = useState(120);
  const [guestVolume, setGuestVolume] = useState(2400);
  const [issueFreq, setIssueFreq] = useState(0.08);
  const [recoveryRate, setRecoveryRate] = useState(0.82);
  const [valuePerRecovery, setValuePerRecovery] = useState(340);
  const [minutesSaved, setMinutesSaved] = useState(22);
  const [conversionRate, setConversionRate] = useState(0.28);
  const [avgRevenuePerConversion, setAvgRevenuePerConversion] = useState(280);

  const incidents = guestVolume * issueFreq;
  const monthlyValueProtected = incidents * recoveryRate * valuePerRecovery;
  const revenueCreated = guestVolume * conversionRate * avgRevenuePerConversion * 0.08;
  const staffHoursSaved = (incidents * minutesSaved) / 60;
  const escalationsPrevented = Math.round(incidents * recoveryRate * 0.35);
  const assuranceRecords = Math.round(incidents);

  const fmt = (n: number) => n >= 1000 ? `$${(n / 1000).toFixed(1)}k` : `$${Math.round(n).toLocaleString()}`;

  return (
    <PartnerRoomLayout>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "72px 32px 140px" }}>

        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 8, letterSpacing: "0.2em", color: "rgba(255,255,255,0.22)", textTransform: "uppercase", fontWeight: 700, marginBottom: 10 }}>
            Commercial · Proof of Value
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", marginBottom: 10 }}>
            Value Calculator
          </div>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.38)", lineHeight: 1.7, maxWidth: 560 }}>
            Adjust synthetic assumptions to model your property or portfolio, then explore illustrative value hypotheses for discussion. These outputs are not measured results or proven outcomes, and accountable people must validate any real business case.
          </p>
          <div style={{ marginTop: 14, padding: "8px 14px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", display: "inline-block" }}>
            <span style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700 }}>Illustrative hypotheses only · not measured, validated or proven</span>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
          {/* Inputs */}
          <div style={{ padding: "32px 30px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ fontSize: 9, letterSpacing: "0.18em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", fontWeight: 700, marginBottom: 28 }}>
              Your Property / Portfolio
            </div>
            <SliderInput label="Rooms / Sites" value={rooms} min={10} max={500} step={5}    format={v => `${v}`}         onChange={setRooms} color="#10b981" />
            <SliderInput label="Guests per month" value={guestVolume} min={100} max={10000} step={100} format={v => `${v.toLocaleString()}`} onChange={setGuestVolume} color="#10b981" />
            <SliderInput label="Issue frequency (% of guests)" value={issueFreq} min={0.02} max={0.25} step={0.01} format={v => `${Math.round(v * 100)}%`} onChange={setIssueFreq} color="#f97316" />
            <SliderInput label="Recovery rate" value={recoveryRate} min={0.4} max={0.98} step={0.01} format={v => `${Math.round(v * 100)}%`} onChange={setRecoveryRate} color="#c9a84c" />
            <SliderInput label="Illustrative value hypothesis per modelled recovery ($)" value={valuePerRecovery} min={50} max={1200} step={10} format={v => `$${v}`} onChange={setValuePerRecovery} color="#c9a84c" />
            <SliderInput label="Staff minutes saved per incident" value={minutesSaved} min={5} max={90} step={1} format={v => `${v} min`} onChange={setMinutesSaved} color="#3b82f6" />
            <SliderInput label="Marketplace conversion rate" value={conversionRate} min={0.05} max={0.55} step={0.01} format={v => `${Math.round(v * 100)}%`} onChange={setConversionRate} color="#a78bfa" />
            <SliderInput label="Avg revenue per conversion ($)" value={avgRevenuePerConversion} min={50} max={800} step={10} format={v => `$${v}`} onChange={setAvgRevenuePerConversion} color="#a78bfa" />
          </div>

          {/* Outputs */}
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <div style={{ padding: "20px 24px", background: "rgba(201,168,76,0.05)", border: "1px solid rgba(201,168,76,0.15)", borderTop: "2px solid #c9a84c" }}>
              <div style={{ fontSize: 9, letterSpacing: "0.18em", color: "#c9a84c", textTransform: "uppercase", fontWeight: 700, marginBottom: 18 }}>
                Illustrative Monthly Hypotheses
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
                <OutputCard label="Modelled Value Protection" value={fmt(monthlyValueProtected)} sub="Service recovery × rate × avg value" color="#c9a84c" />
                <OutputCard label="Modelled Revenue Opportunity" value={fmt(revenueCreated)} sub="Marketplace activations × conversion" color="#10b981" />
                <OutputCard label="Modelled Staff Time" value={`${Math.round(staffHoursSaved)} hrs`} sub={`${minutesSaved} min × ${Math.round(incidents)} incidents`} color="#3b82f6" />
                <OutputCard label="Modelled Escalation Reduction" value={`${escalationsPrevented}`} sub="~35% of recovered incidents" color="#f97316" />
              </div>
            </div>

            <div style={{ padding: "22px 24px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ fontSize: 9, letterSpacing: "0.18em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", fontWeight: 700, marginBottom: 18 }}>
                Operational Output
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
                 <OutputCard label="Modelled Assurance Records" value={`${assuranceRecords.toLocaleString()}`} sub="Illustrative incident-record hypothesis" color="#a78bfa" />
                <OutputCard label="Monthly Incidents" value={`${Math.round(incidents)}`} sub={`${Math.round(issueFreq * 100)}% of ${guestVolume.toLocaleString()} guests`} color="rgba(255,255,255,0.3)" />
              </div>
            </div>

            <div style={{ padding: "20px 24px", background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.05)" }}>
              <div style={{ fontSize: 9, letterSpacing: "0.16em", color: "rgba(255,255,255,0.22)", textTransform: "uppercase", fontWeight: 700, marginBottom: 10 }}>Combined Monthly Hypothesis</div>
              <div style={{ fontSize: 32, fontWeight: 800, color: "#c9a84c", letterSpacing: "-0.02em" }}>
                {fmt(monthlyValueProtected + revenueCreated)}
              </div>
              <div style={{ fontSize: 10.5, color: "rgba(255,255,255,0.28)", marginTop: 4 }}>
                Modelled value opportunity · indicative estimate only · validate in a named pilot
              </div>
            </div>
          </div>
        </div>

      </div>
    </PartnerRoomLayout>
  );
}
