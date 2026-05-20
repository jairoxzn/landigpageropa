import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] grid place-items-center px-6 text-center">
      <div>
        <p className="text-7xl mb-4">🌸</p>
        <h1 className="heading-lg mb-3">Página no encontrada</h1>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          La página que buscas no existe o fue movida. Mientras tanto, descubre
          nuestra colección.
        </p>
        <div className="flex justify-center gap-3">
          <Button asChild variant="gradient">
            <Link href="/">Volver al inicio</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/catalogo">Ver catálogo</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
