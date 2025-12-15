import ProductsPage from "@/components/ProductsPage";
import { getProducts } from "@/services/api";

export const metadata = {
  title: 'Candle Holders',
};

export default async function CandleHoldersPage() {
  const { products, categoryId } = await getProducts('candle-holders', ['candle-holders'], 100);

  return <ProductsPage categoryId={categoryId} products={products} category="Candle Holders" />
}

