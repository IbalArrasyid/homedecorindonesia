const base = process.env.NEXT_PUBLIC_WC_STORE_URL;
const key = process.env.WC_READ_KEY;
const secret = process.env.WC_READ_SECRET;

const BASE_URL = `${base}/wp-json/wc/v3`;

export async function fetchJson(path) {
  const auth = Buffer.from(`${key}:${secret}`).toString('base64');

  const res = await fetch(`${BASE_URL}${path}&stock_status=instock&status=publish`, {
    headers: {
      Authorization: `Basic ${auth}`,
    },
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch ${path}: ${res.status}`);
  }

  return res.json();
}

export async function getCategoryId(categorySlug, categoryName) {
  let cats = await fetchJson(`/products/categories?slug=${categorySlug}&per_page=1`);
  if (Array.isArray(cats) && cats[0]?.id) return cats[0].id;

  cats = await fetchJson(`/products/categories?per_page=100`);
  if (!Array.isArray(cats)) return null;

  let match = cats.find((c) => (c?.slug || '').toLowerCase() === categorySlug);
  if (match) return match.id;

  categoryName.forEach((value) => {
    match = cats.find(c => (c?.name || '').toLowerCase().includes(value));
  })

  return match ? match.id : null;
}

export async function getProducts(categorySlug, categoryName, numberPerPage) {
  try {
    const categoryId = await getCategoryId(categorySlug, categoryName);
    const data = await fetchJson(`/products?category=${categoryId}&per_page=${numberPerPage}`)

    return {
      categoryId,
      products: Array.isArray(data) ? data : [],
    }
  } catch (error) {
    throw new Error(`Failed to get products Error: ${error.message}`);
  }
}

