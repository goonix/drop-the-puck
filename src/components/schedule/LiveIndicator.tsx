export function LiveIndicator() {
  return (
    <span className="relative inline-flex">
      <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
      <span className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-75" />
    </span>
  );
}
