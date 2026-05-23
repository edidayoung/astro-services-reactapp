import { Wifi, Phone, MessageCircle, Mail, MapPin, Facebook, Instagram, Twitter } from "lucide-react";

const quick = ["Home", "New Arrivals", "Categories", "Reviews", "Deals"];
const service = ["About Us", "Contact Us", "Shipping & Delivery", "Returns & Refunds", "Terms & Conditions"];

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-background/60 backdrop-blur">
      <div className="container mx-auto grid gap-10 px-4 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-primary shadow-glow">
              <Wifi className="h-5 w-5 rotate-45 text-primary-foreground" />
            </div>
            <div className="font-display text-lg font-bold">Astro Services</div>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Your trusted partner for premium electronics. Quality products, best prices, and excellent service guaranteed.
          </p>
          <div className="mt-5 flex gap-3">
            {[Facebook, Instagram, MessageCircle, Twitter].map((Icon, i) => (
              <a key={i} href="#" className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface/60 text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground">
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-display font-semibold">Quick Links</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            {quick.map((q) => (
              <li key={q}><a href="#" className="hover:text-primary-glow">{q}</a></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-display font-semibold">Customer Service</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            {service.map((q) => (
              <li key={q}><a href="#" className="hover:text-primary-glow">{q}</a></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-display font-semibold">Contact Us</h4>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-primary-glow" /> 09133993369</li>
            <li className="flex items-center gap-2"><MessageCircle className="h-4 w-4 text-primary-glow" /> 09133993369</li>
            <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-primary-glow" /> astroservices@gmail.com</li>
            <li className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary-glow" /> Lagos, Nigeria</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/50">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-4 px-4 py-5 text-xs text-muted-foreground">
          <div>© 2026 Astro Services. All rights reserved.</div>
          <div className="flex items-center gap-2">
            {["VISA", "MC", "Verve"].map((p) => (
              <span key={p} className="rounded-md border border-border/60 bg-surface/60 px-3 py-1 font-semibold">{p}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
