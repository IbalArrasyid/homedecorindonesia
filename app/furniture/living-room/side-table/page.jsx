
import ProductsPage from "@/components/ProductsPage";
import { getProducts } from "@/services/api";

export const metadata = {
  title: 'Side Table',
};

export default async function SideTablePage() {
  const { products, categoryId } = await getProducts('side-table', ['side-table'], 100);

  return <ProductsPage categoryId={categoryId} products={products} category="Side Table" />
}

