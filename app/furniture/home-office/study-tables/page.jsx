import ProductsPage from "@/components/ProductsPage";
import { getProducts } from "@/services/api";

export const metadata = {
  title: 'Study Tables',
};

export default async function StudyTablesPage() {
  const { products, categoryId } = await getProducts('study-tables', ['study-tables'], 100);

  return <ProductsPage categoryId={categoryId} products={products} category="Study Tables" />
}

