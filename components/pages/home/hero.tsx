import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface Banner {
  image: string;
  image_md: string;
}

const banners: Banner[] = [
  {
    image: "/images/pages/home/hero-banner-1.png",
    image_md: "/images/pages/home/hero-banner-1.png",
  },
  {
    image: "/images/pages/home/hero-banner-2.png",
    image_md: "/images/pages/home/hero-banner-2.png",
  },
  {
    image: "/images/pages/home/hero-banner-3.png",
    image_md: "/images/pages/home/hero-banner-3.png",
  },
  {
    image: "/images/pages/home/hero-banner-4.png",
    image_md: "/images/pages/home/hero-banner-4.png",
  },
];

export default function Hero() {
  return (
    <section className="w-full py-6 md:py-8">
      <div className="overflow-hidden rounded-none shadow-md border border-slate-200 md:rounded-2xl">
        <Carousel
          className="w-full"
          opts={{
            align: "start",
            loop: true,
          }}
        >
          <CarouselContent>
            {banners.map((banner, index) => (
              <CarouselItem key={index} className="relative w-full">
                <div className="relative w-full aspect-16/6">
                  <Image
                    src={banner.image}
                    alt="Gravis promotional banner"
                    fill
                    className="block rounded-none object-cover md:hidden"
                    priority={index === 0}
                  />
                  {/* Desktop Image */}
                  <Image
                    src={banner.image_md}
                    alt="Gravis promotional banner"
                    fill
                    className="hidden object-cover h-full w-full rounded-none md:block"
                    priority={index === 0}
                    quality={100}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-3 top-1/2 h-9 w-9 -translate-y-1/2 rounded-full border border-slate-200 bg-white/90 text-slate-700 shadow-sm hover:bg-white hover:text-[#0046B7] md:left-4" />
          <CarouselNext className="absolute right-3 top-1/2 h-9 w-9 -translate-y-1/2 rounded-full border border-slate-200 bg-white/90 text-slate-700 shadow-sm hover:bg-white hover:text-[#0046B7] md:right-4" />
        </Carousel>
      </div>
    </section>
  );
}
