import ProductsNav from '@/components/layout/ProductsNav';
import ProductsHeader from '@/components/products/ProductsHeader';
import ProductCategories from '@/components/products/ProductCategories';
import FilterSidebar from '@/components/products/FilterSidebar';
import ProductGrid from '@/components/products/ProductGrid';
// import { useSearchParams } from 'next/navigation';

export default function ProductsPage() {
  return (
    <>
      {/* <ProductsNav /> */}
      <main className="w-full bg-black min-h-screen">
        <ProductsHeader />
        <ProductCategories />
        <div className="max-w-[1600px] mx-auto py-10 px-6 md:px-8">
          <div className="flex gap-6">
            <FilterSidebar />
            <ProductGrid />
          </div>
        </div>
      </main>
    </>
  );
}
