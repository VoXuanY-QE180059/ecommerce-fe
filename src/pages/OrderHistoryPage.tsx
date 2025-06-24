import React, { useState, useEffect } from 'react';
import { Package, Clock, CheckCircle, XCircle, Truck, AlertCircle, X, ChevronDown, ChevronUp } from 'lucide-react';

import { getOrderHistory, cancelOrder } from '../services/orderApi';

interface OrderProduct {
  productId: string;
  quantity: number;
  price: number;
}

interface Order {
  orderId: string;
  userId: string;
  products: OrderProduct[];
  totalAmount: number;
  shippingAddress: string;
  phoneNumber: string;
  notes?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

const OrderHistoryPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(null);
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchOrderHistory();
  }, []);

  const fetchOrderHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getOrderHistory();
      if (response.success) {
        setOrders(response.data);
      } else {
        setError(response.message || 'Không thể tải lịch sử đơn hàng');
      }
    } catch (err: any) {
      setError(err.message || 'Đã xảy ra lỗi khi tải lịch sử đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) {
      return;
    }

    try {
      setCancellingOrderId(orderId);
      const response = await cancelOrder(orderId);
      
      if (response.success) {
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order.orderId === orderId 
              ? { ...order, status: 'cancelled' }
              : order
          )
        );
        alert('Đơn hàng đã được hủy thành công!');
      } else {
        alert(response.message || 'Không thể hủy đơn hàng');
      }
    } catch (err: any) {
      alert(err.message || 'Đã xảy ra lỗi khi hủy đơn hàng');
    } finally {
      setCancellingOrderId(null);
    }
  };

  const toggleOrderExpansion = (orderId: string) => {
    setExpandedOrders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'confirmed':
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
      case 'shipping':
        return <Truck className="w-4 h-4 text-orange-500" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'Chờ xác nhận';
      case 'confirmed':
        return 'Đã xác nhận';
      case 'shipping':
        return 'Đang giao hàng';
      case 'completed':
        return 'Hoàn thành';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'confirmed':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'shipping':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'completed':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'cancelled':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const canCancelOrder = (status: string) => {
    return ['pending', 'confirmed'].includes(status.toLowerCase());
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải lịch sử đơn hàng...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Có lỗi xảy ra</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchOrderHistory}
            className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 max-w-5xl">
        <div className="flex items-center mb-6">
          <Package className="w-6 h-6 text-green-500 mr-3" />
          <h1 className="text-2xl font-bold text-gray-800">Lịch sử đơn hàng</h1>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-600 mb-2">Chưa có đơn hàng nào</h2>
            <p className="text-gray-500">Bạn chưa có đơn hàng nào. Hãy mua sắm ngay!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <div key={order.orderId} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
                {/* Compact Header */}
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    {/* Left side - Order info */}
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900 text-lg">
                          #{order.orderId.slice(-8)}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                          {getStatusText(order.status)}
                        </span>
                      </div>
                      <div className="hidden sm:flex items-center text-sm text-gray-500">
                        {formatDate(order.createdAt)}
                      </div>
                    </div>

                    {/* Right side - Price and actions */}
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-sm text-gray-500">
                          {order.products.length} sản phẩm
                        </div>
                        <div className="text-lg font-bold text-green-600">
                          {formatCurrency(order.totalAmount)}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-2">
                        {canCancelOrder(order.status) && (
                          <button
                            onClick={() => handleCancelOrder(order.orderId)}
                            disabled={cancellingOrderId === order.orderId}
                            className="flex items-center px-3 py-1.5 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            {cancellingOrderId === order.orderId ? (
                              <>
                                <div className="animate-spin rounded-full h-3 w-3 border-b border-red-600 mr-1"></div>
                                Hủy đơn
                              </>
                            ) : (
                              <>
                                <X className="w-3 h-3 mr-1" />
                                Hủy đơn
                              </>
                            )}
                          </button>
                        )}
                        
                        <button
                          onClick={() => toggleOrderExpansion(order.orderId)}
                          className="flex items-center px-3 py-1.5 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          Chi tiết
                          {expandedOrders.has(order.orderId) ? (
                            <ChevronUp className="w-3 h-3 ml-1" />
                          ) : (
                            <ChevronDown className="w-3 h-3 ml-1" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Mobile date */}
                  <div className="sm:hidden mt-2 text-sm text-gray-500">
                    {formatDate(order.createdAt)}
                  </div>
                </div>

                {/* Expandable Content */}
                {expandedOrders.has(order.orderId) && (
                  <div className="border-t border-gray-100 p-4 bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Thông tin giao hàng</h4>
                        <div className="space-y-1 text-sm text-gray-600">
                          <div><strong>Địa chỉ:</strong> {order.shippingAddress}</div>
                          <div><strong>Số điện thoại:</strong> {order.phoneNumber}</div>
                          {order.notes && <div><strong>Ghi chú:</strong> {order.notes}</div>}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Chi tiết sản phẩm</h4>
                        <div className="space-y-1">
                          {order.products.map((product, index) => (
                            <div key={index} className="flex justify-between text-sm text-gray-600">
                              <span>Sản phẩm #{product.productId} × {product.quantity}</span>
                              <span className="font-medium">{formatCurrency(product.price * product.quantity)}</span>
                            </div>
                          ))}
                          <div className="flex justify-between font-semibold text-gray-800 pt-2 border-t border-gray-200">
                            <span>Tổng cộng:</span>
                            <span className="text-green-600">{formatCurrency(order.totalAmount)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistoryPage;