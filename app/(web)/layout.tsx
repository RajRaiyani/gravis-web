import Header from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";
import { FloatingContact } from "@/components/shared/floating-contact";

export default function WebLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <FloatingContact />
    </div>
  );
}
