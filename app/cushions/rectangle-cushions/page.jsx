import ProductsPage from "@/components/ProductsPage";
import { getProducts } from "@/services/api";

export const metadata = {
  title: 'Rectangle Cushions',
};

export default async function RectangleCushionsPage() {
  const { products, categoryId } = await getProducts('rectangle-cushions', ['rectangle-cushions'], 100);

  return <ProductsPage categoryId={categoryId} products={products} category="Rectangle Cushions" />
}

