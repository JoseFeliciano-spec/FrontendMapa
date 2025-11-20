export default function PageLoader() {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#07111d", // Fuerza el color oscuro
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-sky-500 border-t-transparent" />
        <p className="text-white">Cargando aeropuertos...</p>
      </div>
    </div>
  );
}
