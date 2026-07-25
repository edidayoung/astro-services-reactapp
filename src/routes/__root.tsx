import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { Toaster } from "sonner";

import { CartProvider } from "@/lib/contexts/CartContext";
import { AuthProvider } from "@/lib/contexts/AuthContext";
import { CartModal } from "@/components/site/CartModal";
import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Astro Services - Premium Electronics | Smartphones, Laptops & Audio" },
      { name: "description", content: "Shop premium electronics at Astro Services. Find the latest smartphones, laptops, gaming gear, audio equipment, and accessories. Quality products, unbeatable prices, and excellent customer service in Nigeria." },
      { name: "keywords", content: "electronics store, smartphones Nigeria, laptops Nigeria, gaming gear, audio equipment, mobile phones, MacBook, iPhone, Samsung, premium electronics, Akwa Ibom electronics" },
      { name: "author", content: "Astro Services" },
      { name: "robots", content: "index, follow" },
      
      // Open Graph Meta Tags
      { property: "og:title", content: "Astro Services - Premium Electronics" },
      { property: "og:site_name", content: "Astro Services" },
      { property: "og:description", content: "Your one-stop shop for premium electronics. Discover the latest smartphones, laptops, gaming gear, and audio equipment at unbeatable prices." },
      { property: "og:image", content: "https://astroigadgets.xyz/hero-products.png" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://astroigadgets.xyz/" },
      { property: "og:locale", content: "en_US" },
      
      // Twitter Card Meta Tags
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@AstroServices" },
      { name: "twitter:title", content: "Astro Services - Premium Electronics" },
      { name: "twitter:description", content: "Your one-stop shop for premium electronics. Smartphones, laptops, audio equipment, and accessories at unbeatable prices." },
      { name: "twitter:image", content: "https://astroigadgets.xyz/hero-products.png" },
      
      // PWA Meta Tags
      { name: "theme-color", content: "#8B5CF6" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
      { name: "apple-mobile-web-app-title", content: "Astro Services" },
    ],
    links: [
      {
        rel: "icon",
        type: "image/svg+xml",
        href: "/favicon.svg",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "192x192",
        href: "/icon-192.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "512x512",
        href: "/icon-512.png",
      },
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: "/icon-192.png",
      },
      {
        rel: "canonical",
        href: "https://astroigadgets.xyz/",
      },
      {
        rel: "manifest",
        href: "/manifest.json",
      },
      {
        rel: "stylesheet",
        href: appCss,
      },
      {
        rel: "preconnect",
        href: "https://fonts.googleapis.com",
      },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;600;700&display=swap",
      },
    ],
    scripts: [
      // Google Analytics
      {
        type: "text/javascript",
        src: "https://www.googletagmanager.com/gtag/js?id=G-1L74DSJWZ7",
        async: true,
      },
      {
        type: "text/javascript",
        children: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-1L74DSJWZ7');
        `,
      },
      // Structured Data (JSON-LD)
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Store",
          "name": "Astro Services",
          "description": "Your one-stop shop for premium electronics",
          "url": "https://astroigadgets.xyz/",
          "telephone": "+234-913-399-3369",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Akwa Ibom",
            "addressCountry": "NG"
          },
          "priceRange": "₦₦₦",
          "image": "https://astroigadgets.xyz/hero-products.png",
          "sameAs": [
            "https://facebook.com/AstroEkpanya",
            "https://wa.me/2349133993369"
          ]
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <Toaster 
            position="top-right"
            duration={2000}
            toastOptions={{
              style: {
                background: 'oklch(0.21 0.04 280)',
                color: 'oklch(0.98 0.005 280)',
                border: '1px solid oklch(0.3 0.04 280 / 0.6)',
              },
            }}
          />
          <Outlet />
          <CartModal />
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
