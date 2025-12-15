import ProductsPage from "@/components/ProductsPage";
import { getProducts } from "@/services/api";

export const metadata = {
  title: 'Flower Arrangement',
};

export default async function FlowerArrangementPage() {
  const { products, categoryId } = await getProducts('flower-arrangement', ['flower-arrangement'], 100);

  return <ProductsPage categoryId={categoryId} products={products} category="Flower Arrangement" />
}

