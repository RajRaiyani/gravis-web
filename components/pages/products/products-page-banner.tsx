import Image from "next/image";

interface ProductsPageBannerProps {
  url: string;
  alt: string;
}

export function ProductsPageBanner({ url, alt }: ProductsPageBannerProps) {
  return (
    <section className="w-full py-0 md:py-8">
      <div className="overflow-hidden rounded-none shadow-md md:rounded-2xl md:border md:border-slate-200">
        <div className="relative w-full aspect-16/6">
          <Image
            src={url}
            alt={alt}
            fill
            className="object-cover rounded-none"
            priority={false}
            quality={100}
          />
        </div>
      </div>
    </section>
  );
}
