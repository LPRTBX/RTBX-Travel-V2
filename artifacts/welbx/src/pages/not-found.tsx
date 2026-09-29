import { Link } from "wouter";

export default function NotFound() {
  return (
    <div style={{
      minHeight: "100dvh",
      background: "hsl(198 56% 12%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 32,
    }}>
      <div style={{ width: "100%", maxWidth: 480, textAlign: "center" }}>
        <div style={{ fontSize: 11, letterSpacing: "0.2em", color: "#a8dedb", textTransform: "uppercase", fontWeight: 700, marginBottom: 20 }}>
          JALDO Travel
        </div>
        <div style={{ fontSize: 64, fontWeight: 800, color: "#fff", letterSpacing: "-0.03em", marginBottom: 12 }}>
          404
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#fff", marginBottom: 14 }}>
          Page not found
        </h1>
        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.7, marginBottom: 32 }}>
          The page you're looking for doesn't exist or may have moved. Check the link you followed, or return to a known starting point below.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/">
            <div style={{
              padding: "12px 24px", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
              cursor: "pointer", background: "#a8dedb", color: "hsl(198 56% 14%)", border: "1px solid #a8dedb",
            }}>
              Homepage
            </div>
          </Link>
          <Link href="/partner-room">
            <div style={{
              padding: "12px 24px", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
              cursor: "pointer", background: "transparent", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.15)",
            }}>
              Partner Room
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
