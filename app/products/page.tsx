import Link from 'next/link'
import { products } from '@/data/products'
import { filterProducts } from '@/lib/filter-products'

const PAGE_SIZE = 4

type PageProps = {
  searchParams: Promise<{
    q?: string
    category?: string
    sort?: string
    page?: string
    minPrice?: string
    maxPrice?: string
  }>
}

function parsePrice(value?: string): number | undefined {
  if (!value) return undefined
  const num = Number(value)
  if (!Number.isFinite(num) || num < 0) return undefined
  return num
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const params = await searchParams
  const query = params.q ?? ''
  const category = params.category ?? 'all'
  const sort =
    params.sort === 'price-asc' || params.sort === 'price-desc'
      ? params.sort
      : 'name'

  const rawMinPrice = parsePrice(params.minPrice)
  const rawMaxPrice = parsePrice(params.maxPrice)
  const minPrice =
    rawMinPrice !== undefined && rawMaxPrice !== undefined && rawMinPrice > rawMaxPrice
      ? rawMaxPrice
      : rawMinPrice
  const maxPrice =
    rawMinPrice !== undefined && rawMaxPrice !== undefined && rawMinPrice > rawMaxPrice
      ? rawMinPrice
      : rawMaxPrice

  const filtered = filterProducts(products, {
    query,
    category,
    sort,
    minPrice,
    maxPrice,
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))

  const requestedPage = Number(params.page ?? '1')
  const currentPage = Number.isInteger(requestedPage)
    ? Math.min(Math.max(requestedPage, 1), totalPages)
    : 1

  const start = (currentPage - 1) * PAGE_SIZE
  const visibleProducts = filtered.slice(start, start + PAGE_SIZE)

  const isFirstPage = currentPage <= 1
  const isLastPage = currentPage >= totalPages

  function pageHref(page: number) {
    const nextParams = new URLSearchParams()
    if (query) nextParams.set('q', query)
    if (category !== 'all') nextParams.set('category', category)
    if (sort !== 'name') nextParams.set('sort', sort)
    if (minPrice !== undefined) nextParams.set('minPrice', String(minPrice))
    if (maxPrice !== undefined) nextParams.set('maxPrice', String(maxPrice))
    nextParams.set('page', String(page))
    return `/products?${nextParams.toString()}`
  }

  return (
    <div className="min-h-screen w-full bg-white text-slate-900">
      <main className="mx-auto max-w-6xl px-5 py-12">
        <h1 className="text-4xl font-bold text-slate-900">Product Finder</h1>

        <form
          action="/products"
          method="get"
          className="mt-8 grid gap-4 rounded-2xl bg-slate-100 p-5 md:grid-cols-4"
        >
          <label className="md:col-span-2">
            <span className="mb-1 block text-sm font-medium text-slate-700">คำค้นหา</span>
            <input
              type="search"
              name="q"
              defaultValue={query}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900"
            />
          </label>

          <label>
            <span className="mb-1 block text-sm font-medium text-slate-700">หมวดหมู่</span>
            <select
              name="category"
              defaultValue={category}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900"
            >
              <option value="all">ทั้งหมด</option>
              <option value="office">Office</option>
              <option value="tech">Tech</option>
              <option value="lifestyle">Lifestyle</option>
            </select>
          </label>

          <label>
            <span className="mb-1 block text-sm font-medium text-slate-700">เรียงตาม</span>
            <select
              name="sort"
              defaultValue={sort}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900"
            >
              <option value="name">ชื่อ</option>
              <option value="price-asc">ราคาน้อยไปมาก</option>
              <option value="price-desc">ราคามากไปน้อย</option>
            </select>
          </label>

          <label>
            <span className="mb-1 block text-sm font-medium text-slate-700">ราคาต่ำสุด (บาท)</span>
            <input
              type="number"
              name="minPrice"
              min={0}
              inputMode="numeric"
              defaultValue={minPrice ?? ''}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900"
            />
          </label>

          <label>
            <span className="mb-1 block text-sm font-medium text-slate-700">ราคาสูงสุด (บาท)</span>
            <input
              type="number"
              name="maxPrice"
              min={0}
              inputMode="numeric"
              defaultValue={maxPrice ?? ''}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900"
            />
          </label>

          <div className="flex gap-3 md:col-span-4">
            <button className="rounded-lg bg-indigo-700 px-5 py-2 font-medium text-white hover:bg-indigo-800">
              ค้นหา
            </button>
            <Link
              href="/products"
              className="rounded-lg border border-slate-300 bg-white px-5 py-2 text-slate-700 hover:bg-slate-50"
            >
              ล้างตัวกรอง
            </Link>
          </div>
        </form>

        <p role="status" className="my-6 text-sm text-slate-600">
          พบ {filtered.length} รายการ · หน้า {currentPage} จาก {totalPages}
        </p>
        {visibleProducts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center">
            <h2 className="text-xl font-semibold text-slate-900">ไม่พบสินค้า</h2>
            <p className="mt-2 text-slate-600">ลองเปลี่ยนคำค้นหาหรือหมวดหมู่</p>
          </div>
        ) : (
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {visibleProducts.map((product) => (
              <li key={product.id} className="rounded-2xl border border-slate-200 p-5">
                <p className="text-sm uppercase text-indigo-700">
                  {product.category}
                </p>
                <h2 className="mt-2 text-lg font-semibold text-slate-900">{product.name}</h2>
                <p className="mt-4 text-2xl font-bold text-slate-900">
                  {product.price.toLocaleString('th-TH')} บาท
                </p>
              </li>
            ))}
          </ul>
        )}
        

        <nav aria-label="Pagination" className="mt-8 flex items-center justify-center gap-2">
          {isFirstPage ? (
            <span
              aria-disabled="true"
              className="cursor-not-allowed rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-slate-400"
            >
              « ก่อนหน้า
            </span>
          ) : (
            <Link
              href={pageHref(currentPage - 1)}
              className="rounded-lg border border-slate-300 px-4 py-2 text-slate-700 hover:bg-slate-50"
            >
              « ก่อนหน้า
            </Link>
          )}

          {Array.from({ length: totalPages }, (_, index) => index + 1).map(
            (page) => (
              <Link
                key={page}
                href={pageHref(page)}
                aria-current={page === currentPage ? 'page' : undefined}
                className="rounded-lg border border-slate-300 px-4 py-2 text-slate-700 aria-[current=page]:border-indigo-700 aria-[current=page]:bg-indigo-700 aria-[current=page]:text-white"
              >
                {page}
              </Link>
            ),
          )}

          {isLastPage ? (
            <span
              aria-disabled="true"
              className="cursor-not-allowed rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-slate-400"
            >
              ถัดไป »
            </span>
          ) : (
            <Link
              href={pageHref(currentPage + 1)}
              className="rounded-lg border border-slate-300 px-4 py-2 text-slate-700 hover:bg-slate-50"
            >
              ถัดไป »
            </Link>
            
          )}
        </nav>
        <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 rounded-lg bg-indigo-700 px-6 py-3 font-medium text-white transition hover:bg-indigo-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2"
                >
                  กลับไปหน้าหลัก
                  <span aria-hidden="true"></span>
                </Link>
            </div>
      </main>
    </div>
  )
}