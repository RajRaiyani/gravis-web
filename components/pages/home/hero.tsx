import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { listCategoryBanners } from "@/services/api/product-category.api";

interface BannerImage {
  url: string;
  alt: string;
}

export default async function Hero() {
  let apiBanners: BannerImage[] = [];

  try {
    const banners = await listCategoryBanners();
    apiBanners = (banners ?? [])
      .filter((banner) => banner?.banner_image?.url)
      .map((banner) => ({
        url: banner.banner_image!.url,
        alt: banner.name ?? "Banner",
      }));
  } catch (error) {
    console.error("Failed to fetch banners:", error);
  }

  const defaultBanner: BannerImage = {
    url: "/images/pages/home/hero-banner-1.png",
    alt: "Gravis promotional banner",
  };

  const allBanners = [defaultBanner, ...apiBanners];

  if (allBanners.length === 0) {
    allBanners.push(defaultBanner);
  }

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
            {allBanners.map((banner, index) => (
              <CarouselItem key={index} className="relative w-full">
                <div className="relative w-full aspect-16/6">
                  <Image
                    src={banner.url}
                    alt={banner.alt}
                    fill
                    className="block rounded-none object-cover md:hidden"
                    priority={index === 0}
                  />
                  <Image
                    src={banner.url}
                    alt={banner.alt}
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
