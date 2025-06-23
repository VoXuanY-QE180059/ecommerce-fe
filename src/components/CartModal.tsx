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

  if (!isOpen) return null;

  const getImageSrc = (image?: string | File) => {
    if (image instanceof File) {
      return URL.createObjectURL(image);
    }
    if (typeof image === "string" && image) {
      return `${API_URL}${image}`;
    }
    return "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg";
  };

  const handleCheckout = () => {
    if (!isLoggedIn) {
      alert("Vui lòng đăng nhập để thực hiện thanh toán!");
      return;
    }
    onProceedToOrder();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Modal với animation fade-in từ dưới lên */}
      <div
        className={`
        relative bg-white rounded-lg shadow-2xl 
        w-full max-w-[70vw] max-h-[80vh] 
        sm:max-w-lg md:max-w-xl
        transform transition-all duration-300 ease-out
        ${
          isOpen
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-5 scale-95"
        }
        flex flex-col overflow-hidden
      `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="w-6 h-6 text-gray-700" />
            <h2 className="text-lg font-semibold text-gray-900">
              Giỏ hàng ({getTotalItems()})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 min-h-0">
          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <ShoppingBag className="w-16 h-16 mb-4 text-gray-300" />
                <p className="text-lg font-medium">Giỏ hàng trống</p>
                <p className="text-sm text-center mt-2">
                  Hãy thêm sản phẩm vào giỏ hàng để bắt đầu mua sắm
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                  >
                    {/* Product Image */}
                    <img
                      src={getImageSrc(item.product.image)}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-md"
                    />

                    {/* Product Info */}
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

                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="p-1 hover:bg-gray-200 rounded-full transition-colors duration-200"
                        disabled={item.quantity <= 1}
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
                        className="p-1 hover:bg-gray-200 rounded-full transition-colors duration-200"
                        disabled={item.quantity >= item.product.stock}
                      >
                        <Plus className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-1 hover:bg-red-100 rounded-full transition-colors duration-200 text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer - Luôn hiển thị khi có sản phẩm */}
          {cartItems.length > 0 && (
            <div className="border-t border-gray-200 p-4 bg-white">
              {/* Total */}
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold text-gray-900">
                  Tổng cộng:
                </span>
                <span className="text-lg font-bold text-green-600">
                  ₫{getTotalPrice().toFixed(2)}
                </span>
              </div>

              {/* Checkout Button - Luôn hiển thị với design nhất quán */}
              <button
                onClick={handleCheckout}
                className="w-full py-3 px-4 rounded-lg font-semibold text-white
                  bg-gradient-to-r from-blue-600 to-blue-700 
                  hover:from-blue-700 hover:to-blue-800
                  active:from-blue-800 active:to-blue-900
                  shadow-lg hover:shadow-xl 
                  transform hover:-translate-y-0.5 active:translate-y-0
                  transition-all duration-200 ease-out
                  flex items-center justify-center space-x-2
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <CreditCard className="w-5 h-5" />
                <span>Thanh toán</span>
              </button>

              {/* Thông báo trạng thái - Luôn hiển thị */}
              <div
                className={`
                mt-3 p-3 rounded-md border transition-all duration-200
                ${
                  !isLoggedIn
                    ? "bg-amber-50 border-amber-200"
                    : "bg-green-50 border-green-200"
                }
              `}
              >
                <p
                  className={`
                  text-sm text-center font-medium
                  ${!isLoggedIn ? "text-amber-700" : "text-green-700"}
                `}
                >
                  {!isLoggedIn
                    ? "⚠️ Vui lòng đăng nhập để tiếp tục thanh toán"
                    : "✅ Sẵn sàng thanh toán - Nhấn để tiến hành"}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
