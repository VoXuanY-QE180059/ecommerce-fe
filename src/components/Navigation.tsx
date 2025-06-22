import { useState } from 'react';
import { Home, Plus, LogIn, UserPlus, LogOut, User, ShoppingCart, Package } from 'lucide-react';
import { isAuthenticated, getCurrentUser, logout } from '../services/auth';
import LogoutModal from './LogoutModal';
import React from 'react';

interface NavigationProps {
  currentPage: string;
  navigateTo: (page: string) => void;
  isLoggedIn: boolean;
  onAuthChange: () => void;
  cartItemsCount?: number;
  onCartOpen?: () => void;
}

export default function Navigation({ 
  currentPage, 
  navigateTo, 
  isLoggedIn, 
  onAuthChange,
  cartItemsCount = 0,
  onCartOpen
}: NavigationProps) {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const loggedIn = isAuthenticated();
  const currentUser = getCurrentUser();

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = () => {
    logout();
    if (onAuthChange) {
      onAuthChange();
    }
    navigateTo('home');
    setShowLogoutModal(false);
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };

  return (
    <>
      <nav className="bg-white text-black py-3 px-4 sm:px-6 shadow-sm sticky top-0 z-50 font-roboto">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-light tracking-wide">Quản lý sản phẩm</h1>

          <div className="flex items-center space-x-3">
            {/* Trang chủ */}
            <button
              onClick={() => navigateTo('home')}
              className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-all duration-200 ${
                currentPage === 'home' ? 'bg-green-400 text-black' : 'hover:bg-gray-100'
              }`}
              aria-label="Đi đến trang chủ"
            >
              <Home size={18} />
              <span className="hidden sm:inline text-sm font-medium">Trang chủ</span>
            </button>

            {/* Giỏ hàng */}
            <button
              onClick={onCartOpen}
              className="relative flex items-center space-x-1 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-gray-100"
              aria-label="Mở giỏ hàng"
            >
              <ShoppingCart size={18} />
              <span className="hidden sm:inline text-sm font-medium">Giỏ hàng</span>
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemsCount > 99 ? '99+' : cartItemsCount}
                </span>
              )}
            </button>

            {/* Đơn hàng - Chỉ khi đăng nhập */}
            {loggedIn && (
              <button
                onClick={() => navigateTo('orders')}
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-all duration-200 ${
                  currentPage === 'orders' ? 'bg-green-400 text-black' : 'hover:bg-gray-100'
                }`}
                aria-label="Xem đơn hàng"
              >
                <Package size={18} />
                <span className="hidden sm:inline text-sm font-medium">Đơn hàng</span>
              </button>
            )}

            {/* Thêm sản phẩm - Chỉ khi đăng nhập */}
            {loggedIn && (
              <button
                onClick={() => navigateTo('form')}
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-all duration-200 ${
                  currentPage === 'form' ? 'bg-green-400 text-black' : 'hover:bg-gray-100'
                }`}
                aria-label="Thêm sản phẩm mới"
              >
                <Plus size={18} />
                <span className="hidden sm:inline text-sm font-medium">Thêm sản phẩm</span>
              </button>
            )}

            {/* Giao diện người dùng / đăng nhập */}
            <div className="flex items-center space-x-2 border-l border-gray-300 pl-4 ml-4">
              {loggedIn ? (
                <div className="flex items-center space-x-2">
                  <div className="hidden md:flex items-center space-x-2 px-3 py-2 bg-gray-100 rounded-lg">
                    <User size={16} />
                    <span className="text-sm font-medium">{currentUser?.email}</span>
                    <span className="text-xs bg-gray-300 px-2 py-1 rounded capitalize">
                      {currentUser?.role}
                    </span>
                  </div>

                  <button
                    onClick={handleLogoutClick}
                    className="flex items-center space-x-1 px-3 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                    aria-label="Đăng xuất"
                  >
                    <LogOut size={18} />
                    <span className="hidden sm:inline text-sm">Đăng xuất</span>
                  </button>
                </div>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={() => navigateTo('login')}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-all duration-200 ${
                      currentPage === 'login' ? 'bg-green-400 text-black' : 'hover:bg-gray-100'
                    }`}
                    aria-label="Đăng nhập"
                  >
                    <LogIn size={18} />
                    <span className="hidden sm:inline text-sm font-medium">Đăng nhập</span>
                  </button>

                  <button
                    onClick={() => navigateTo('register')}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-all duration-200 ${
                      currentPage === 'register' ? 'bg-green-400 text-black' : 'hover:bg-gray-100'
                    }`}
                    aria-label="Đăng ký"
                  >
                    <UserPlus size={18} />
                    <span className="hidden sm:inline text-sm font-medium">Đăng ký</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Modal xác nhận đăng xuất */}
      <LogoutModal 
        show={showLogoutModal}
        onConfirm={handleLogoutConfirm}
        onCancel={handleLogoutCancel}
      />
    </>
  );
}