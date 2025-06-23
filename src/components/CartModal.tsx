import React from "react";
import { X, Plus, Minus, Trash2, ShoppingBag, CreditCard } from "lucide-react";
import { useCart } from "../context/CartContext";
import { isAuthenticated } from "../services/auth";

const API_URL = "https://ecommerce-be-p4qj.onrender.com";

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProceedToOrder: () => void;
}

export default function CartModal({
  isOpen,
  onClose,
  onProceedToOrder,
}: CartModalProps) {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    getTotalPrice,
    getTotalItems,
  } = useCart();
  const isLoggedIn = isAuthenticated();

  const getImageSrc = (image?: string | File) => {
    if (!image)
      return "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg";
    return image instanceof File
      ? URL.createObjectURL(image)
      : `${API_URL}${image}`;
  };

  const handleCheckout = () => {
    if (!isLoggedIn) {
      alert("Vui lòng đăng nhập để thực hiện thanh toán!");
      return;
    }
    if (cartItems.length === 0) {
      alert("Giỏ hàng trống!");
      return;
    }
    onProceedToOrder();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop với hiệu ứng mờ đúng cách */}
      <div
        className="fixed inset-0 z-40 bg-black/15 backdrop-blur transition-opacity duration-300"
        style={{ backdropFilter: 'blur(2px)' }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal content */}
      <div className="fixed inset-0 z-50 flex items-center justify-center pt-16 p-4">
        <div
          className={`
            relative bg-white rounded-lg shadow-xl
            w-full max-w-[50vw] max-h-[60vh]
            md:max-w-2xl
            transform transition-all duration-300 ease-out
            ${isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95"}
            flex flex-col overflow-hidden
          `}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 sticky top-0 bg-white z-10">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-6 h-6 text-gray-700" />
              <h2 className="text-lg font-semibold text-gray-900">
                Giỏ hàng ({getTotalItems()})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Đóng giỏ hàng"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500 p-4">
                <ShoppingBag className="w-16 h-16 mb-4 text-gray-300" />
                <p className="text-lg font-medium">Giỏ hàng trống</p>
                <p className="text-sm text-center mt-2">
                  Hãy thêm sản phẩm vào giỏ hàng để bắt đầu mua sắm
                </p>
              </div>
            ) : (
              <div className="space-y-3 p-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <img
                      src={getImageSrc(item.product.image)}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-md flex-shrink-0"
                      loading="lazy"
                    />

                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {item.product.name}
                      </h4>
                      <p className="text-sm text-gray-500">
                        ₫{item.product.price.toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-400">
                        Tồn kho: {item.product.stock}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                        disabled={item.quantity <= 1}
                        aria-label="Giảm số lượng"
                      >
                        <Minus className="w-4 h-4" />
                      </button>

                      <span className="w-8 text-center text-sm font-medium">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                        disabled={item.quantity >= item.product.stock}
                        aria-label="Tăng số lượng"
                      >
                        <Plus className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-1 hover:bg-red-100 rounded-full transition-colors text-red-500"
                        aria-label="Xóa sản phẩm"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {cartItems.length > 0 && (
            <div className="border-t border-gray-200 p-4 bg-white sticky bottom-0">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold">Tổng cộng:</span>
                <span className="text-lg font-bold text-green-600">
                  ₫{getTotalPrice().toFixed(2)}
                </span>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full py-3 px-4 rounded-lg font-semibold text-white
                bg-gradient-to-r from-blue-600 to-blue-700 
                hover:from-blue-700 hover:to-blue-800
                active:from-blue-800 active:to-blue-900
                shadow hover:shadow-md 
                transition-all duration-200
                flex items-center justify-center gap-2
                focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <CreditCard className="w-5 h-5" />
                <span>Thanh toán</span>
              </button>

              <div
                className={`mt-3 p-3 rounded-md border ${
                  !isLoggedIn
                    ? "bg-amber-50 border-amber-200 text-amber-700"
                    : "bg-green-50 border-green-200 text-green-700"
                }`}
              >
                <p className="text-sm text-center font-medium">
                  {!isLoggedIn
                    ? "⚠️ Vui lòng đăng nhập để tiếp tục thanh toán"
                    : "✅ Sẵn sàng thanh toán - Nhấn để tiến hành"}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
