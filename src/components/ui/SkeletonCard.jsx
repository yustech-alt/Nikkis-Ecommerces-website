export default function SkeletonCard() {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)" }}
    >
      <style>{`
        @keyframes shimmer {
          0%   { background-position: -400px 0; }
          100% { background-position: 400px 0; }
        }
        .shimmer {
          background: linear-gradient(
            90deg,
            var(--bg-elevated) 25%,
            var(--bg-card) 50%,
            var(--bg-elevated) 75%
          );
          background-size: 800px 100%;
          animation: shimmer 1.5s infinite linear;
        }
      `}</style>

      {/* Image placeholder */}
      <div className="aspect-square shimmer" />

      {/* Info placeholder */}
      <div className="p-4 flex flex-col gap-3">
        <div className="shimmer h-3 w-16 rounded-full" />
        <div className="shimmer h-4 w-full rounded-full" />
        <div className="shimmer h-4 w-3/4 rounded-full" />
        <div className="shimmer h-3 w-24 rounded-full" />
        <div className="flex items-center justify-between mt-1">
          <div className="shimmer h-5 w-16 rounded-full" />
          <div className="shimmer h-7 w-7 rounded-lg" />
        </div>
      </div>
    </div>
  );
}