import ProductsPage from "@/components/ProductsPage";
import { getProducts } from "@/services/api";

export const metadata = {
  title: 'Decorative Stools',
};

export default async function DecorativeStoolsPage() {
  const { products, categoryId } = await getProducts('decorative-stools', ['decorative-stools'], 100);

  return <ProductsPage categoryId={categoryId} products={products} category="Decorative Stools" />
}

