import { Home, Plus } from 'lucide-react';

interface NavigationProps {
  currentPage: string;
  navigateTo: (page: string) => void;
}

export default function Navigation({ currentPage, navigateTo }: NavigationProps) {
  return (
    <nav className="bg-white text-black py-3 px-4 sm:px-6 shadow-sm sticky top-0 z-50 font-roboto">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo/Title */}
        <h1 className="text-2xl font-light tracking-wide">Quản lý sản phẩm</h1>

        {/* Navigation Buttons */}
        <div className="flex space-x-3">
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
        </div>
      </div>
    </nav>
  );
}