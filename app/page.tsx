import Link from "next/link";
import { Kanit, Noto_Sans_Thai, IBM_Plex_Mono } from "next/font/google";
import { products } from "@/data/products";

const kanit = Kanit({
  subsets: ["thai", "latin"],
  weight: ["600", "700"],
  variable: "--font-display",
});

const notoSansThai = Noto_Sans_Thai({
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-mono",
});

const categories = [
  {
    code: "OFFICE",
    th: "สินค้าออฟฟิศ",
    href: "/products?category=office",
    rotate: "-rotate-6",
    delay: "[animation-delay:0ms]",
    dot: "bg-amber-500",
    text: "text-amber-700",
  },
  {
    code: "TECH",
    th: "อุปกรณ์ไอที",
    href: "/products?category=tech",
    rotate: "rotate-3",
    delay: "[animation-delay:600ms]",
    dot: "bg-indigo-600",
    text: "text-indigo-700",
  },
  {
    code: "LIFESTYLE",
    th: "ไลฟ์สไตล์",
    href: "/products?category=lifestyle",
    rotate: "-rotate-2",
    delay: "[animation-delay:1200ms]",
    dot: "bg-emerald-600",
    text: "text-emerald-700",
  },
];


export default function Home() {
  const totalCount = products.length;
  const categoryCount = new Set(products.map((p) => p.category)).size;

  return (
    <div
      className={`${kanit.variable} ${notoSansThai.variable} ${plexMono.variable} min-h-screen w-full bg-white text-slate-900 [font-family:var(--font-body)]`}
    >
      <style>{`
        @keyframes tag-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
      `}</style>

      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-6">
        <span className="text-lg font-semibold tracking-tight [font-family:var(--font-display)]">
          Product Finder
        </span>
      </header>

      <main>
        <section className="relative mx-auto max-w-6xl overflow-hidden px-5 pb-20 pt-10 md:pt-16">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-indigo-50 blur-3xl"
          />

          <div className="relative grid gap-14 md:grid-cols-2 md:items-center">
            <div>
              <p className="[font-family:var(--font-mono)] text-xs font-medium uppercase tracking-[0.2em] text-indigo-700">
                Product Finder
              </p>

              <h1 className="mt-4 text-4xl font-bold leading-tight [font-family:var(--font-display)] sm:text-5xl">
                หาไอเทมที่ใช่
                <br />
                ในไม่กี่คลิก
              </h1>

              <p className="mt-5 max-w-md text-base leading-relaxed text-slate-600">
                ค้นหา กรองตามช่วงราคา และเรียงลำดับสินค้า Office, Tech และ
                Lifestyle ได้ในหน้าเดียว
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 rounded-lg bg-indigo-700 px-6 py-3 font-medium text-white transition hover:bg-indigo-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2"
                >
                  ดูสินค้าทั้งหมด
                  <span aria-hidden="true">→</span>
                </Link>

                <span className="[font-family:var(--font-mono)] text-sm text-slate-500">
                  {totalCount} รายการ · {categoryCount} หมวดหมู่
                </span>
              </div>
            </div>

            <div
              className="relative flex flex-wrap items-start justify-center gap-6 md:justify-end"
              aria-label="หมวดหมู่สินค้า"
            >
              {categories.map((category) => (
                <Link
                  key={category.code}
                  href={category.href}
                  className={`group relative ${category.rotate} transition-transform duration-300 hover:rotate-0 focus-visible:rotate-0 focus-visible:outline-none`}
                >
                  <span
                    aria-hidden="true"
                    className={`absolute -top-2 left-6 h-3 w-3 rounded-full ring-4 ring-white ${category.dot}`}
                  />
                  <div
                    className={`motion-safe:[animation:tag-float_5s_ease-in-out_infinite] ${category.delay} min-w-[9rem] rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-lg transition-shadow group-hover:shadow-xl group-focus-visible:ring-2 group-focus-visible:ring-indigo-600 group-focus-visible:ring-offset-2`}
                  >
                    <p
                      className={`[font-family:var(--font-mono)] text-[0.65rem] font-semibold uppercase tracking-widest ${category.text}`}
                    >
                      {category.code}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">
                      {category.th}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

    
      </main>

      <footer className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-5 py-8 text-sm text-slate-400 sm:flex-row">
      </footer>
    </div>
  );
}