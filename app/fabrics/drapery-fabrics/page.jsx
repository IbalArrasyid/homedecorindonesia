import ProductsPage from "@/components/ProductsPage";
import { getProducts } from "@/services/api";

export const metadata = {
  title: 'Drapery Fabric',
};

export default async function DraperyFabricPage() {
  const { products, categoryId } = await getProducts('draperyfabrics', ['draperyfabrics'], 100);

  return <ProductsPage categoryId={categoryId} products={products} category="Drapery Fabric" />
}

