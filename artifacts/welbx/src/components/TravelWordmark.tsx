/** Shared approved JALDO wordmark for the Travel experience. */
export function TravelWordmark() {
  return (
    <span className="jaldo-travel-wordmark" aria-label="JALDO Travel">
      <img src={`${import.meta.env.BASE_URL}brand/jaldo-logo-white.webp`} alt="JALDO" width="133" height="35" />
      <span>Travel</span>
    </span>
  );
}
