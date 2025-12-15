import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export async function fetchJson(path) {
  const base = process.env.NEXT_PUBLIC_WC_STORE_URL; // gunakan domain WooCommerce langsung
  const key = process.env.WC_READ_KEY;
  const secret = process.env.WC_READ_SECRET;

  // Basic Auth
  const auth = Buffer.from(`${key}:${secret}`).toString('base64');

  const res = await fetch(`${base}/wp-json/wc/v3${path}&stock_status=instock&status=publish`, {
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

/**
 * Load external script dynamically
 * @param {string} src - Script URL
 * @returns {Promise} - Resolves when script is loaded
 */
export function loadScript(src) {
  return new Promise((resolve, reject) => {
    // Check if script is already loaded
    if (typeof window !== 'undefined' && document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = resolve;
    script.onerror = reject;

    document.head.appendChild(script);
  });
}

/**
 * Format currency to IDR
 * @param {number} amount - Amount to format
 * @returns {string} - Formatted currency string
 */
export function formatCurrency(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}
