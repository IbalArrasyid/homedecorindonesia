import 'server-only'; 
// ^ PENTING: Baris ini mencegah fungsi ini terimpor secara tidak sengaja 
// ke komponen Client (browser), menjaga API Keys tetap aman.

const BASE_URL = process.env.NEXT_PUBLIC_WC_STORE_URL;
const CK = process.env.WC_READ_KEY; // Gunakan key Read (atau Write jika Read tidak ada)
const CS = process.env.WC_READ_SECRET;

// Helper untuk otentikasi
const getAuthHeader = () => {
  if (!CK || !CS) {
    throw new Error("WooCommerce Keys (CK/CS) tidak ditemukan di Environment Variables.");
  }
  return `Basic ${Buffer.from(`${CK}:${CS}`).toString('base64')}`;
};

/**
 * Mengambil data produk spesifik untuk validasi server-side.
 * Fungsi ini TIDAK melakukan caching agresif untuk memastikan harga/stok realtime.
 * * @param {number|string} id - Product ID
 * @returns {Promise<Object>} - Data produk yang sudah disanitasi
 */
export async function getProductById(id) {
  if (!id) throw new Error("Product ID diperlukan");

  const endpoint = `${BASE_URL}/wp-json/wc/v3/products/${id}`;

  try {
    const res = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Authorization': getAuthHeader(),
        'Content-Type': 'application/json',
      },
      // PENTING UNTUK CHECKOUT: 
      // Gunakan 'no-store' agar kita selalu mendapat harga/stok DETIK INI JUGA.
      // Jangan gunakan revalidate waktu (ISR) untuk validasi pembayaran.
      cache: 'no-store', 
    });

    if (!res.ok) {
      if (res.status === 404) return null; // Produk tidak ditemukan
      throw new Error(`WooCommerce Error: ${res.status} ${res.statusText}`);
    }

    const product = await res.json();

    // Sanitasi: Hanya kembalikan data yang dibutuhkan logic server
    // untuk mengurangi memori overhead.
    return {
      id: product.id,
      name: product.name,
      price: product.price,       // Harga saat ini (termasuk sale price jika ada)
      regular_price: product.regular_price,
      sale_price: product.sale_price,
      stock_status: product.stock_status,
      stock_quantity: product.stock_quantity,
      manage_stock: product.manage_stock
    };

  } catch (error) {
    console.error(`[ServerHelper] Gagal fetch product ID ${id}:`, error);
    throw error; // Lempar error agar API route tahu transaksi harus batal
  }
}

/**
 * (Opsional) Jika toko Anda memiliki produk variasi (misal: Baju Ukuran L)
 * Anda perlu validasi harga variasi, bukan harga parent produk.
 */
export async function getVariationById(parentId, variationId) {
    if (!parentId || !variationId) throw new Error("Parent ID dan Variation ID diperlukan");
  
    const endpoint = `${BASE_URL}/wp-json/wc/v3/products/${parentId}/variations/${variationId}`;
  
    // ... logic fetch sama dengan di atas ...
    // ... return price dari variasi ...
}