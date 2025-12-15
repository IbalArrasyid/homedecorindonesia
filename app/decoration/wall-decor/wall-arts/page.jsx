import ProductsPage from "@/components/ProductsPage";
import { getProducts } from "@/services/api";

export const metadata = {
  title: 'Wall Arts',
};

export default async function WallArtsPage() {
  const { products, categoryId } = await getProducts('wall-arts', ['wall-arts'], 100);

  return <ProductsPage categoryId={categoryId} products={products} category="Wall Arts" />
}

