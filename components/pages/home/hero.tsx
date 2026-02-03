import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { Users } from "lucide-react";

interface Banner {
  image: string;
  image_md: string;
}

const banner: Banner[] = [
  {
    image: "/images/pages/home/hero-banner-2.png",
    image_md: "/images/pages/home/hero-banner-2.png",
  },
];

export default function Hero() {
  return (
    <section className="w-full py-7">
      <div className="container mx-auto rounded-2xl bg-white overflow-hidden shadow-lg">
        <Carousel
          className="w-full h-[80svh]"
          opts={{
            align: "start",
            loop: true,
          }}
        >
          <CarouselContent>
            {banner.map((category, index) => (
              <CarouselItem
                key={index}
                className="flex rounded-xl flex-col w-full h-full justify-between items-center"
              >
                <div className="bg-white rounded-xl w-full h-full">
                  {/* Mobile Image */}
                  <Image
                    src={category.image}
                    alt={category.image}
                    fill
                    className="w-full rounded-xl object-contain block sm:max-h-[85vh] sm:object-cover sm:object-bottom md:hidden"
                    priority
                  />
                  {/* Desktop Image */}
                  <Image
                    src={category.image_md}
                    alt={category.image_md}
                    width={3000}
                    height={1500}
                    className="w-full h-full rounded-xl object-cover object-top hidden md:block"
                    quality={100}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute h-12 w-12 left-4 border-red-600 text-red-600 hover:bg-red-600/20 hover:text-red-600" />
          <CarouselNext className="absolute h-12 w-12 right-4 border-red-600 text-red-600 hover:bg-red-600/20 hover:text-red-600" />
        </Carousel>
      </div>
    </section>
  );
}
