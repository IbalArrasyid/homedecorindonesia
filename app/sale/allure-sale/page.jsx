import ProductsPage from "@/components/ProductsPage";
import { getProducts } from "@/services/api";

export const metadata = {
  title: 'Allure Sale',
};

export default async function AllureSalePage() {
  const { products, categoryId } = await getProducts('allure', ['allure'], 100);

  return <ProductsPage categoryId={categoryId} products={products} category="Allure Sale" />
}

