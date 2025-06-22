export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  stock: number;
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  shippingAddress?: {
    fullName: string;
    address: string;
    city: string;
    zipCode: string;
    phone: string;
  };
}

export interface OrderFormData {
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    zipCode: string;
    phone: string;
  };
}