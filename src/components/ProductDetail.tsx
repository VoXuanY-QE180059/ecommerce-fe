import React, { useState } from 'react';
import { ArrowLeft, Edit3, Trash2, ShoppingCart, Plus, Minus } from 'lucide-react';
import type { Product } from '../types/product.ts';

const API_URL = 'https://ecommerce-be-p4qj.onrender.com';

interface ProductDetailProps {
  product: Product;
  navigateTo: (page: string, product?: Product) => void;
  confirmDelete: (product: Product) => void;
  isLoggedIn: boolean;
  onAddToCart?: (product: Product, quantity?: number) => void;
}

export default function ProductDetail({
  product,
  navigateTo,
  confirmDelete,
  isLoggedIn,
  onAddToCart,
}: ProductDetailProps) {
  const [quantity, setQuantity] = useState(1);

  const getImageSrc = () => {
    if (product.image instanceof File) {
      return URL.createObjectURL(product.image);
    }
    if (typeof product.image === 'string' && product.image) {
      return `${API_URL}${product.image}`;
    }
    return null;
  };

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    if (onAddToCart && product.stock > 0 && quantity > 0) {
      onAddToCart(product, quantity);
    }
  };

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8 font-roboto">
      {/* Back Button */}
      <button
        onClick={() => navigateTo('home')}
        className="flex items-center space-x-2 text-black hover:text-green-400 mb-8 transition-all duration-200 group"
        aria-label="Quay lại danh sách sản phẩm"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
        <span className="text-base font-light">Quay lại</span>
      </button>

      {/* Product Detail Container */}
      <div className="bg-white rounded-2xl shadow-sm max-w-4xl mx-auto transition-all duration-200 hover:shadow-md overflow-hidden">
        <div className="md:flex">
          {/* Product Image */}
          <div className="md:w-1/2">
            <img
              src={getImageSrc() || 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg'}
              alt={product.name}
              className="w-full h-60 md:h-80 object-cover rounded-t-2xl md:rounded-t-none md:rounded-l-2xl transition-transform duration-200 hover:scale-102"
            />
          </div>

          {/* Product Details */}
          <div className="md:w-1/2 p-6 md:p-8">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-3xl font-light text-black tracking-wide">{product.name}</h1>
              <span
                className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                  product.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}
              >
                {product.isActive ? 'Đang hoạt động' : 'Không hoạt động'}
              </span>
            </div>
            <p className="text-gray-600 text-sm mb-4 leading-relaxed">{product.description}</p>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-sm font-medium">Giá:</span>
                <span className="text-lg font-medium text-black">₫{product.price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-sm font-medium">Danh mục:</span>
                <span className="text-black text-sm font-medium">{product.category}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-sm font-medium">Tồn kho:</span>
                <span className="text-black text-sm font-medium">{product.stock} đơn vị</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-sm font-medium">Mã sản phẩm:</span>
                <span className="text-black text-sm font-medium">#{product.id}</span>
              </div>
            </div>

            {/* Add to Cart Section */}
            {onAddToCart && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-gray-700">Số lượng:</span>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed flex items-center justify-center transition-colors duration-200"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= product.stock}
                      className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed flex items-center justify-center transition-colors duration-200"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0 || !product.isActive}
                  className={`w-full py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-all duration-200 font-medium ${
                    product.stock === 0 || !product.isActive
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-500 hover:bg-blue-600 text-white hover:shadow-md'
                  }`}
                >
                  <ShoppingCart size={18} />
                  <span>
                    {product.stock === 0 
                      ? 'Hết hàng' 
                      : !product.isActive 
                      ? 'Sản phẩm không khả dụng'
                      : `Thêm vào giỏ hàng (${quantity})`}
                  </span>
                </button>
                {product.stock > 0 && product.isActive && (
                  <div className="mt-2 text-center">
                    <span className="text-sm text-gray-600">
                      Tổng: ₫{(product.price * quantity).toFixed(2)}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Admin Actions */}
            {isLoggedIn ? (
              <div className="flex flex-col sm:flex-row sm:space-x-3 space-y-3 sm:space-y-0">
                <button
                  onClick={() => navigateTo('form', product)}
                  className="flex-1 bg-green-400 hover:bg-green-500 text-black px-5 py-2.5 rounded-lg flex items-center justify-center space-x-2 transition-all duration-200 hover:shadow-sm"
                  aria-label="Chỉnh sửa sản phẩm"
                >
                  <Edit3 size={18} />
                  <span className="font-medium text-sm">Chỉnh sửa</span>
                </button>
                <button
                  onClick={() => confirmDelete(product)}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-lg flex items-center justify-center space-x-2 transition-all duration-200 hover:shadow-sm"
                  aria-label="Xóa sản phẩm"
                >
                  <Trash2 size={18} />
                  <span className="font-medium text-sm">Xóa</span>
                </button>
              </div>
            ) : (
              <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 text-center mt-4">
                <p className="text-gray-600 text-sm">
                  <button
                    onClick={() => navigateTo('login')}
                    className="text-green-500 hover:underline transition-colors duration-150 font-medium"
                  >
                    Đăng nhập
                  </button>{' '}
                  để quản lý sản phẩm này.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}