export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black relative">
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 100% 100%, hsla(210, 100%, 85%, 0.12) 0%, hsla(210, 100%, 55%, 0.04) 40%, transparent 65%)",
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
