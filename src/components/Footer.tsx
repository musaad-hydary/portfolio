export default function Footer() {
  return (
    <div className="flex justify-center items-center py-6">
      <p
        className="text-[0.55rem] tracking-wider"
        style={{ color: "var(--col-ghost)", fontFamily: "DM Mono, monospace" }}
      >
        © {new Date().getFullYear()} musaad hydary
      </p>
    </div>
  );
}
