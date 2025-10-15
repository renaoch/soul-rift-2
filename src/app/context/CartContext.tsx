"use client";

import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';

interface CartItem {
  id: string;
  productId: string;
  designId?: string;
  artistId?: string;
  name: string;
  artist: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
  image: string;
  productColor: string;
}

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
  isLoading: boolean;
}

type CartAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ITEMS'; payload: CartItem[] }
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'CLEAR_CART' };

const initialState: CartState = {
  items: [],
  total: 0,
  itemCount: 0,
  isLoading: false,
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_ITEMS':
      const items = action.payload;
      return {
        ...state,
        items,
        total: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
        itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
      };
    
    case 'ADD_ITEM':
      const existingItem = state.items.find(
        item => item.productId === action.payload.productId && 
                 item.size === action.payload.size && 
                 item.color === action.payload.color
      );
      
      let newItems;
      if (existingItem) {
        newItems = state.items.map(item =>
          item.id === existingItem.id
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
      } else {
        newItems = [...state.items, action.payload];
      }
      
      return {
        ...state,
        items: newItems,
        total: newItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
        itemCount: newItems.reduce((sum, item) => sum + item.quantity, 0),
      };
    
    case 'UPDATE_QUANTITY':
      const updatedItems = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: Math.max(1, action.payload.quantity) }
          : item
      );
      
      return {
        ...state,
        items: updatedItems,
        total: updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
        itemCount: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
      };
    
    case 'REMOVE_ITEM':
      const filteredItems = state.items.filter(item => item.id !== action.payload);
      return {
        ...state,
        items: filteredItems,
        total: filteredItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
        itemCount: filteredItems.reduce((sum, item) => sum + item.quantity, 0),
      };
    
    case 'CLEAR_CART':
      return initialState;
    
    default:
      return state;
  }
}

interface CartContextType extends CartState {
  addItem: (item: Omit<CartItem, 'id'>) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart on mount
  useEffect(() => {
    refreshCart();
  }, []);

  const refreshCart = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await fetch('/api/cart');
      const result = await response.json();
      
      if (result.success) {
        dispatch({ type: 'SET_ITEMS', payload: result.items });
      }
    } catch (error) {
      toast.error('Failed to load cart');
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const addItem = async (item: Omit<CartItem, 'id'>) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      
      const result = await response.json();
      
      if (result.success) {
        dispatch({ type: 'ADD_ITEM', payload: { ...item, id: result.id } });
        toast.success('Added to cart!');
      } else {
        toast.error(result.error?.message || 'Failed to add item');
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const updateQuantity = async (id: string, quantity: number) => {
    try {
      const response = await fetch(`/api/cart/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity }),
      });
      
      if (response.ok) {
        dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
      }
    } catch (error) {
      toast.error('Failed to update quantity');
    }
  };

  const removeItem = async (id: string) => {
    try {
      const response = await fetch(`/api/cart/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        dispatch({ type: 'REMOVE_ITEM', payload: id });
        toast.success('Removed from cart');
      }
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  const clearCart = async () => {
    try {
      const response = await fetch('/api/cart', {
        method: 'DELETE',
      });
      
      if (response.ok) {
        dispatch({ type: 'CLEAR_CART' });
      }
    } catch (error) {
      toast.error('Failed to clear cart');
    }
  };

  return (
    <CartContext.Provider
      value={{
        ...state,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
