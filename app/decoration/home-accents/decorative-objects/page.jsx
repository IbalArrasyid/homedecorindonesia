import ProductsPage from "@/components/ProductsPage";
import { getProducts } from "@/services/api";

export const metadata = {
  title: 'Decorative Objects',
};

export default async function DecorativeObjectsPage() {
  const { products, categoryId } = await getProducts('decorative-objects', ['decorative-objects'], 100);

  return <ProductsPage categoryId={categoryId} products={products} category="Decorative Objects" />
}

