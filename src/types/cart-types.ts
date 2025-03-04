export interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface CartItem {
  cartitem_id: number;
  quantity: number;
  product: {
    product_id: string;
    name: string;
    price: number;
    ProductImage: Array<{ url: string }>;
  };
}

export interface CartData {
  items: CartItem[];
  summary: {
    totalItems: number;
    totalQuantity: number;
    totalPrice: number;
  };
}
