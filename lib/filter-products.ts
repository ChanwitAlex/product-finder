import type { Product } from '@/data/products'

export type ProductFilters = {
  query: string
  category: string
  sort: 'name' | 'price-asc' | 'price-desc'
  // undefined = ไม่จำกัดขอบเขตด้านนั้น
  minPrice?: number
  maxPrice?: number
}

export function filterProducts(
  products: Product[],
  filters: ProductFilters,
) {
  const query = filters.query.trim().toLowerCase()

  return products
    .filter((product) => {
      const matchesQuery = product.name.toLowerCase().includes(query)
      const matchesCategory =
        filters.category === 'all' || product.category === filters.category
      const matchesMin =
        filters.minPrice === undefined || product.price >= filters.minPrice
      const matchesMax =
        filters.maxPrice === undefined || product.price <= filters.maxPrice
      return matchesQuery && matchesCategory && matchesMin && matchesMax
    })
    .toSorted((a, b) => {
      if (filters.sort === 'price-asc') return a.price - b.price
      if (filters.sort === 'price-desc') return b.price - a.price
      return a.name.localeCompare(b.name)
    })
}