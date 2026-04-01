const variants = {
  purple: "bg-[#a855f7] text-white",
  red:    "bg-[#f43f5e] text-white",
  green:  "bg-[#22c55e] text-white",
  gray:   "bg-[#1a1a1a] text-[#71717a] border border-[#2a2a2a]",
};

export default function Badge({ label, variant = "purple" }) {
  return (
    <span
      className={`text-[10px] font-semibold px-2.5 py-1 rounded-full tracking-wide ${variants[variant]}`}
    >
      {label}
    </span>
  );
}