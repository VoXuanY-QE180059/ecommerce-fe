import axios from 'axios';
import { getAuthHeaders } from './auth';

const API_URL = 'https://ecommerce-be-p4qj.onrender.com/orders';

export interface OrderProduct {
  productId: string;
  quantity: number;
  price: number;
}

export interface CreateOrderData {
  products: OrderProduct[];
  totalAmount: number;
  shippingAddress: string;
  phoneNumber: string;
  notes?: string;
  status?: 'pending' | 'confirmed' | 'shipping' | 'completed' | 'cancelled';
}

export interface Order {
  id: string;
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

const createAuthenticatedRequest = () => {
  return axios.create({
    headers: getAuthHeaders(),
  });
};

export const createOrder = async (orderData: CreateOrderData) => {
  try {
    const payload = {
      ...orderData,
      status: orderData.status || 'pending',
    };

    const authenticatedAxios = createAuthenticatedRequest();
    const response = await authenticatedAxios.post(`${API_URL}/create`, payload);
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw new Error('Authentication required. Please login first.');
    }
    throw new Error(error.response?.data?.message || 'Failed to create order');
  }
};

export const getOrders = async (page: number = 1, limit: number = 10) => {
  try {
    const authenticatedAxios = createAuthenticatedRequest();
    const response = await authenticatedAxios.get(`${API_URL}/list`, {
      params: { page, limit }
    });
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw new Error('Authentication required. Please login first.');
    }
    throw new Error(error.response?.data?.message || 'Failed to fetch orders');
  }
};

export const getOrder = async (orderId: string) => {
  try {
    const authenticatedAxios = createAuthenticatedRequest();
    const response = await authenticatedAxios.get(`${API_URL}/detail/${orderId}`);
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw new Error('Authentication required. Please login first.');
    }
    throw new Error(error.response?.data?.message || 'Failed to fetch order');
  }
};

export const updateOrderStatus = async (orderId: string, status: string) => {
  try {
    const authenticatedAxios = createAuthenticatedRequest();
    const response = await authenticatedAxios.patch(`${API_URL}/update/${orderId}`, { status });
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw new Error('Authentication required. Please login first.');
    }
    throw new Error(error.response?.data?.message || 'Failed to update order status');
  }
};

export const cancelOrder = async (orderId: string) => {
  try {
    const authenticatedAxios = createAuthenticatedRequest();
    const response = await authenticatedAxios.patch(`${API_URL}/cancel/${orderId}`);
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw new Error('Authentication required. Please login first.');
    }
    throw new Error(error.response?.data?.message || 'Failed to cancel order');
  }
};