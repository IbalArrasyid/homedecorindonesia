import ProductsPage from "@/components/ProductsPage";
import { getProducts } from "@/services/api";

export const metadata = {
  title: 'Mirrors',
};

export default async function MirrorsPage() {
  const { products, categoryId } = await getProducts('mirrors', ['mirrors'], 100);

  return <ProductsPage categoryId={categoryId} products={products} category="Mirrors" />
}

