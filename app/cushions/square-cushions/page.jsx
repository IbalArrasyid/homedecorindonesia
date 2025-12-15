import ProductsPage from "@/components/ProductsPage";
import { getProducts } from "@/services/api";

export const metadata = {
  title: 'Square Cushions',
};

export default async function SquareCushionsPage() {
  const { products, categoryId } = await getProducts('square-cushions', ['square-cushions'], 100);

  return <ProductsPage categoryId={categoryId} products={products} category="Square Cushions" />
}

