import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { BOOKS_DATA, KIDS_BOOKS_DATA } from '../data/books';

export interface BookPrice {
  price: string;
  originalPrice?: string;
}

interface PriceContextType {
  prices: Record<string, BookPrice>;
  getPrice: (bookId: string, fallbackPrice?: string, fallbackOriginalPrice?: string) => BookPrice;
  updatePrice: (bookId: string, price: string, originalPrice?: string) => Promise<boolean>;
  isPriceModalOpen: boolean;
  setPriceModalOpen: (open: boolean) => void;
  isLoading: boolean;
}

const PriceContext = createContext<PriceContextType | undefined>(undefined);

// Build initial map from books.ts
const buildDefaultPrices = (): Record<string, BookPrice> => {
  const map: Record<string, BookPrice> = {};
  [...BOOKS_DATA, ...KIDS_BOOKS_DATA].forEach((b) => {
    map[b.id] = {
      price: b.price || '150 ₺',
      originalPrice: b.originalPrice || '250 ₺'
    };
  });
  return map;
};

export const PriceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [prices, setPrices] = useState<Record<string, BookPrice>>(buildDefaultPrices);
  const [isPriceModalOpen, setPriceModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch prices from server API on mount
  useEffect(() => {
    let isMounted = true;
    const fetchPrices = async () => {
      try {
        const res = await fetch('/api/prices');
        if (res.ok) {
          const data = await res.json();
          if (data && data.prices && isMounted) {
            setPrices((prev) => ({
              ...prev,
              ...data.prices
            }));
          }
        }
      } catch (err) {
        console.warn('Could not load dynamic prices from API, using defaults:', err);
      }
    };

    fetchPrices();

    // Keyboard shortcut for price editor: Ctrl + Shift + P
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        setPriceModalOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      isMounted = false;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const getPrice = (bookId: string, fallbackPrice?: string, fallbackOriginalPrice?: string): BookPrice => {
    if (prices[bookId]) {
      return prices[bookId];
    }
    return {
      price: fallbackPrice || '150 ₺',
      originalPrice: fallbackOriginalPrice || '250 ₺'
    };
  };

  const updatePrice = async (bookId: string, price: string, originalPrice?: string): Promise<boolean> => {
    setIsLoading(true);
    const newEntry = { price, originalPrice };
    const updated = { ...prices, [bookId]: newEntry };
    setPrices(updated);

    try {
      const res = await fetch('/api/prices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prices: { [bookId]: newEntry } })
      });
      setIsLoading(false);
      return res.ok;
    } catch (err) {
      console.error('Error saving price to server:', err);
      setIsLoading(false);
      return false;
    }
  };

  return (
    <PriceContext.Provider
      value={{
        prices,
        getPrice,
        updatePrice,
        isPriceModalOpen,
        setPriceModalOpen,
        isLoading
      }}
    >
      {children}
    </PriceContext.Provider>
  );
};

export const usePrice = () => {
  const context = useContext(PriceContext);
  if (!context) {
    throw new Error('usePrice must be used within a PriceProvider');
  }
  return context;
};
