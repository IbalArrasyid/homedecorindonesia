import ProductsPage from "@/components/ProductsPage";
import { getProducts } from "@/services/api";

export const metadata = {
  title: 'Round Cushions',
};

export default async function RoundCushionsPage() {
  const { products, categoryId } = await getProducts('round-cushions', ['round-cushions'], 100);

  return <ProductsPage categoryId={categoryId} products={products} category="Round Cushions" />
}

