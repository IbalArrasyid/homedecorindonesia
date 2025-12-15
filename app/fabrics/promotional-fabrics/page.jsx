import ProductsPage from "@/components/ProductsPage";
import { getProducts } from "@/services/api";

export const metadata = {
  title: 'Promotional Fabrics',
};

export default async function PromotionalFabricsPage() {
  const { products, categoryId } = await getProducts('promotionalfabrics', ['promotionalfabrics'], 100);

  return <ProductsPage categoryId={categoryId} products={products} category="Promotional Fabrics" />
}

