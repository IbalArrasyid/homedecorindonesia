import ProductsPage from "@/components/ProductsPage";
import { getProducts } from "@/services/api";

export const metadata = {
  title: 'Bowls & Trays',
};

export default async function BowlsTraysPage() {
  const { products, categoryId } = await getProducts('bowls-trays', ['bowls-trays'], 100);

  return <ProductsPage categoryId={categoryId} products={products} category="Bowls & Trays" />
}

