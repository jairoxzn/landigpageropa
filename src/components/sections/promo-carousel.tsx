"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface PromoSlide {
  id: string;
  title: string;
  subtitle?: string | null;
  imageUrl: string;
  ctaLabel?: string | null;
  ctaUrl?: string | null;
}

export function PromoCarousel({ slides }: { slides: PromoSlide[] }) {
  const autoplay = React.useRef(Autoplay({ delay: 5000, stopOnInteraction: false }));
  const [emblaRef, embla] = useEmblaCarousel({ loop: true, align: "start" }, [
    autoplay.current
  ]);

  if (!slides.length) return null;

  return (
    <section className="container-lucia mt-6">
      <div className="relative overflow-hidden rounded-3xl shadow-card">
        <div ref={emblaRef} className="overflow-hidden">
          <div className="flex">
            {slides.map((s) => (
              <div key={s.id} className="relative min-w-0 flex-[0_0_100%]">
                <div className="relative aspect-[21/9] md:aspect-[21/7]">
                  <Image
                    src={s.imageUrl}
                    alt={s.title}
                    fill
                    sizes="100vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
                  <div className="absolute inset-0 flex items-center">
                    <div className="px-8 md:px-16 max-w-xl text-white">
                      <h3 className="font-display text-3xl md:text-5xl font-bold mb-3 text-balance">
                        {s.title}
                      </h3>
                      {s.subtitle && (
                        <p className="text-white/90 mb-5 text-pretty">{s.subtitle}</p>
                      )}
                      {s.ctaUrl && (
                        <Button asChild variant="gradient" size="lg">
                          <Link href={s.ctaUrl}>{s.ctaLabel || "Ver más"}</Link>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => embla?.scrollPrev()}
          aria-label="Anterior"
          className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 grid place-items-center rounded-full bg-white/80 backdrop-blur hover:bg-white"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={() => embla?.scrollNext()}
          aria-label="Siguiente"
          className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 grid place-items-center rounded-full bg-white/80 backdrop-blur hover:bg-white"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </section>
  );
}
