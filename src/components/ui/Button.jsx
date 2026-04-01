const variants = {
  primary:   "bg-[#a855f7] hover:bg-[#9333ea] text-white hover:shadow-[0_0_25px_rgba(168,85,247,0.4)]",
  secondary: "bg-[#1a1a1a] hover:bg-[#222] text-white border border-[#2a2a2a] hover:border-[#a855f7]/40",
  danger:    "bg-[#f43f5e] hover:bg-[#e11d48] text-white",
  ghost:     "bg-transparent hover:bg-[#1a1a1a] text-[#a855f7] border border-[#a855f7]/40 hover:border-[#a855f7]",
};

const sizes = {
  sm:  "px-4 py-2 text-xs",
  md:  "px-6 py-3 text-sm",
  lg:  "px-8 py-3.5 text-sm",
  xl:  "px-10 py-4 text-base",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  onClick,
  disabled = false,
  fullWidth = false,
  type = "button",
  className = "",
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center gap-2
        font-semibold rounded-xl
        transition-all duration-200
        hover:-translate-y-0.5 active:scale-[0.98]
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
    >
      {children}
    </button>
  );
}