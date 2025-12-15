import ProductsPage from "@/components/ProductsPage";
import { getProducts } from "@/services/api";

export const metadata = {
  title: 'Sale Home Decor Furniture',
};

export default async function DraperyFabricPage() {
  const { products, categoryId } = await getProducts('sale-home-decor-furniture', ['sale-home-decor-furniture'], 100);

  return <ProductsPage categoryId={categoryId} products={products} category="Sale Home Decor Furniture" />
}

