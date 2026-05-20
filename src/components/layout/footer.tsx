import Link from "next/link";
import { Instagram, Facebook, Music2, Mail, Phone, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const cols = [
  {
    title: "Tienda",
    links: [
      { href: "/catalogo", label: "Catálogo" },
      { href: "/catalogo?categoria=jeans", label: "Jeans" },
      { href: "/catalogo?categoria=vestidos", label: "Vestidos" },
      { href: "/nueva-coleccion", label: "Nueva colección" }
    ]
  },
  {
    title: "Lucia",
    links: [
      { href: "/sobre-nosotras", label: "Sobre nosotras" },
      { href: "/contacto", label: "Contacto" },
      { href: "/blog", label: "Blog & estilo" }
    ]
  },
  {
    title: "Ayuda",
    links: [
      { href: "/envios", label: "Envíos" },
      { href: "/cambios-devoluciones", label: "Cambios y devoluciones" },
      { href: "/guia-tallas", label: "Guía de tallas" },
      { href: "/preguntas", label: "Preguntas frecuentes" }
    ]
  }
];

export function Footer() {
  return (
    <footer className="relative mt-20 border-t border-border bg-gradient-to-b from-background to-accent/30">
      <div className="container-lucia py-16 md:py-20">
        {/* Newsletter */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-pink-500 text-white p-8 md:p-12 mb-16 shadow-card">
          <div className="absolute inset-0 bg-grain opacity-30" />
          <div className="relative grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="font-display text-3xl md:text-4xl font-bold mb-3">
                Únete al club Lucia 💖
              </h3>
              <p className="text-white/90 max-w-md">
                Recibe lanzamientos exclusivos, ofertas privadas y un 10% OFF en tu
                primera compra.
              </p>
            </div>
            <form className="flex gap-2 w-full">
              <Input
                type="email"
                placeholder="tu@email.com"
                className="bg-white text-black border-0 h-12 flex-1"
                required
              />
              <Button variant="dark" size="lg" type="submit" className="rounded-full">
                Suscribirme
              </Button>
            </form>
          </div>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="relative">
                <span className="block h-9 w-9 rounded-full bg-gradient-to-br from-primary to-pink-400 shadow-soft" />
                <span className="absolute inset-0 grid place-items-center text-white font-bold text-sm">
                  L
                </span>
              </span>
              <span className="font-display text-2xl font-bold tracking-tight">
                Lucia<span className="text-primary">.</span>Jeans
              </span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs mb-6">
              Boutique femenina premium. Jeans, blusas y vestidos pensados para
              mujeres reales que aman verse increíbles.
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4 text-primary" /> +51 999 999 999
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4 text-primary" /> hola@luciajeans.com
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary" /> Lima, Perú
              </li>
            </ul>
          </div>

          {cols.map((c) => (
            <div key={c.title}>
              <h4 className="font-semibold mb-4">{c.title}</h4>
              <ul className="space-y-2">
                {c.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Lucia Jeans. Hecho con 💖 en Perú.
          </p>
          <div className="flex items-center gap-3">
            <a href={process.env.NEXT_PUBLIC_INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="h-9 w-9 grid place-items-center rounded-full bg-accent hover:bg-primary hover:text-white transition-colors">
              <Instagram className="h-4 w-4" />
            </a>
            <a href={process.env.NEXT_PUBLIC_FACEBOOK_URL} target="_blank" rel="noopener noreferrer" className="h-9 w-9 grid place-items-center rounded-full bg-accent hover:bg-primary hover:text-white transition-colors">
              <Facebook className="h-4 w-4" />
            </a>
            <a href={process.env.NEXT_PUBLIC_TIKTOK_URL} target="_blank" rel="noopener noreferrer" className="h-9 w-9 grid place-items-center rounded-full bg-accent hover:bg-primary hover:text-white transition-colors">
              <Music2 className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
