import ProductsPage from "@/components/ProductsPage";
import { getProducts } from "@/services/api";

export const metadata = {
  title: 'Sale Collection',
};

export default async function SaleCollectionPage() {
  const { products, categoryId } = await getProducts('sale', ['sale'], 100);

  return <ProductsPage categoryId={categoryId} products={products} category="Sale Collection" />
}

