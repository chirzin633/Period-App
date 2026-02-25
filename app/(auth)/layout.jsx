export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-linear-to-br from-cerulean-50 via-alice-blue-50 to-pacific-cyan-50 flex flex-col items-center justify-center p-5 relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-cerulean-200/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-pacific-cyan-200/30 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-powder-petal-100/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      {children}
    </div>
  );
}
