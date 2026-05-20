import type { Metadata } from "next";
import { MessageCircle, Mail, Phone, MapPin, Instagram, Facebook } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { whatsappGenericInquiry } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Hablemos. Escríbenos por WhatsApp, redes o este formulario."
};

export default function ContactoPage() {
  return (
    <div className="container-lucia py-14 md:py-20 grid lg:grid-cols-2 gap-12">
      <div>
        <span className="eyebrow mb-3">Contacto</span>
        <h1 className="heading-lg mb-4 text-balance">Hablemos 💖</h1>
        <p className="text-muted-foreground mb-8 max-w-md">
          Estamos para ti. Resuelve dudas, recibe asesoría de estilo o pide un
          pedido especial. Te respondemos súper rápido por WhatsApp.
        </p>

        <ul className="space-y-4 mb-8">
          <li className="flex items-center gap-3">
            <span className="h-11 w-11 rounded-2xl bg-primary/10 text-primary grid place-items-center">
              <Phone className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Llámanos</p>
              <p className="font-medium">+51 999 999 999</p>
            </div>
          </li>
          <li className="flex items-center gap-3">
            <span className="h-11 w-11 rounded-2xl bg-primary/10 text-primary grid place-items-center">
              <Mail className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Email</p>
              <p className="font-medium">hola@luciajeans.com</p>
            </div>
          </li>
          <li className="flex items-center gap-3">
            <span className="h-11 w-11 rounded-2xl bg-primary/10 text-primary grid place-items-center">
              <MapPin className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Showroom</p>
              <p className="font-medium">Av. La Marina 123, Lima — Perú</p>
            </div>
          </li>
        </ul>

        <div className="flex flex-wrap gap-2">
          <Button asChild variant="whatsapp">
            <a href={whatsappGenericInquiry()} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-4 w-4" /> WhatsApp
            </a>
          </Button>
          <Button asChild variant="outline">
            <a href={process.env.NEXT_PUBLIC_INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
              <Instagram className="h-4 w-4" /> Instagram
            </a>
          </Button>
          <Button asChild variant="outline">
            <a href={process.env.NEXT_PUBLIC_FACEBOOK_URL} target="_blank" rel="noopener noreferrer">
              <Facebook className="h-4 w-4" /> Facebook
            </a>
          </Button>
        </div>
      </div>

      <form className="rounded-3xl bg-card border border-border shadow-card p-8 space-y-5">
        <h2 className="font-display text-2xl font-bold">Envíanos un mensaje</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="nombre">Nombre</Label>
            <Input id="nombre" placeholder="Tu nombre" required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="tu@email.com" required />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="asunto">Asunto</Label>
          <Input id="asunto" placeholder="¿En qué te ayudamos?" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="mensaje">Mensaje</Label>
          <Textarea id="mensaje" rows={5} placeholder="Cuéntanos…" required />
        </div>
        <Button type="submit" size="lg" className="w-full">
          Enviar mensaje
        </Button>
      </form>
    </div>
  );
}
