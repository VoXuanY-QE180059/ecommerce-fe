import { useEffect, useState } from 'react';
import { Package, Plus, LayoutGrid, List, AlertTriangle, Loader } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import type { Product } from '../types/product.ts';
import { getProducts } from '../services/api';
import React from 'react';

interface HomePageProps {
  products: Product[];
  setProducts: (products: Product[]) => void;
  navigateTo: (page: string, product?: Product) => void;
  confirmDelete: (product: Product) => void;
  isLoggedIn: boolean;
  onAddToCart?: (product: Product, quantity?: number) => void;
}

export default function HomePage({
  products,
  setProducts,
  navigateTo,
  confirmDelete,
  isLoggedIn,
  onAddToCart,
}: HomePageProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        
        const data = await getProducts();
        setProducts(data.data);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Không thể tải danh sách sản phẩm');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [setProducts]);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center h-96 bg-white/5 rounded-2xl">
          <Loader className="w-12 h-12 text-white/50 animate-spin" />
          <p className="mt-4 text-white/70">Đang tải sản phẩm...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-96 bg-red-900/30 border border-red-500/50 rounded-2xl p-4 text-center">
            <AlertTriangle className="w-12 h-12 text-red-400 mb-4" />
            <h3 className="text-xl font-semibold text-red-300">Đã xảy ra lỗi</h3>
            <p className="mt-2 text-white/70">{error}</p>
        </div>
      );
    }

    if (products.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-96 bg-white/5 rounded-2xl p-4 text-center">
          <Package size={60} className="text-white/30 mb-4" />
          <h3 className="text-2xl font-semibold text-white mb-2">Kho hàng của bạn trống</h3>
          <p className="text-white/60 mb-6 max-w-sm">
            Hiện chưa có sản phẩm nào. Hãy bắt đầu bằng cách thêm sản phẩm đầu tiên của bạn.
          </p>
          {isLoggedIn && (
            <button
              onClick={() => navigateTo('form')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-all duration-300 transform hover:scale-105 active:scale-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-black/20 font-semibold"
            >
              <Plus size={18} />
              <span>Thêm sản phẩm mới</span>
            </button>
          )}
        </div>
      );
    }

    return (
      <div
        className={
          viewMode === 'grid'
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
            : 'flex flex-col gap-6'
        }
      >
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            navigateTo={navigateTo}
            confirmDelete={confirmDelete}
            viewMode={viewMode}
            isLoggedIn={isLoggedIn}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
    );
  };

  return (
    <div 
        className="min-h-screen bg-cover bg-center bg-fixed" 
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1558222218-b7b54e164317?q=80&w=1933&auto=format&fit=crop')" }}
    >
        <div className="min-h-screen bg-black/70 backdrop-blur-sm pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <header className="mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-4xl font-bold text-white tracking-tight">Danh sách Sản phẩm</h1>
                        <p className="mt-2 text-white/60 text-lg">
                            Quản lý kho hàng của bạn một cách trực quan và hiệu quả.
                        </p>
                    </div>

                    {isLoggedIn && (
                    <div className="flex items-center gap-3 flex-shrink-0">
                        <button
                            onClick={() => navigateTo('form')}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 transition-all duration-300 transform hover:scale-105 active:scale-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-black/20 font-semibold shadow-lg"
                        >
                            <Plus size={18} />
                            <span>Thêm mới</span>
                        </button>
                        
                        {/* View Mode Toggle */}
                        <div className="bg-white/10 p-1 rounded-lg flex items-center gap-1">
                             <button
                                onClick={() => setViewMode('grid')}
                                className={`px-3 py-1.5 rounded-md transition-colors duration-300 ${viewMode === 'grid' ? 'bg-white/20 text-white' : 'text-white/50 hover:bg-white/20'}`}
                                aria-label="Chế độ lưới"
                            >
                                <LayoutGrid size={20} />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`px-3 py-1.5 rounded-md transition-colors duration-300 ${viewMode === 'list' ? 'bg-white/20 text-white' : 'text-white/50 hover:bg-white/20'}`}
                                aria-label="Chế độ danh sách"
                            >
                                <List size={20} />
                            </button>
                        </div>
                    </div>
                    )}
                </header>

                {/* Main Content Area */}
                <main>
                    {renderContent()}
                </main>
            </div>
        </div>
    </div>
  );
}