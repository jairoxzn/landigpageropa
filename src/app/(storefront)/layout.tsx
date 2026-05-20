import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { WhatsappFab } from "@/components/common/whatsapp-fab";
import { CartDrawer } from "@/components/common/cart-drawer";

export default function StorefrontLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsappFab />
      <CartDrawer />
    </div>
  );
}
