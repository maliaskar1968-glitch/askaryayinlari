import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { BOOKS_DATA, KIDS_BOOKS_DATA } from '../data/books';
import { getActiveCampaign, calculateDiscount, Campaign } from '../utils/campaign';

export interface BookPrice {
  price: string;
  originalPrice?: string;
  discountRate?: number;
  badge?: string;
}

interface PriceContextType {
  prices: Record<string, BookPrice>;
  getPrice: (bookId: string, fallbackPrice?: string, fallbackOriginalPrice?: string) => BookPrice;
  updatePrice: (bookId: string, price: string, originalPrice?: string) => Promise<boolean>;
  activeCampaign: Campaign | null;
  isPriceModalOpen: boolean;
  setPriceModalOpen: (open: boolean) => void;
  isLoading: boolean;
  refreshPrices: () => void;
}

const PriceContext = createContext<PriceContextType | undefined>(undefined);

// Build initial map from books data and active campaign
const buildCurrentPrices = (campaign: Campaign | null): Record<string, BookPrice> => {
  const map: Record<string, BookPrice> = {};

  [...BOOKS_DATA, ...KIDS_BOOKS_DATA].forEach((b) => {
    const origPrice = b.originalPrice || '250 ₺';
    let currentPrice = b.price || '150 ₺';

    if (campaign) {
      currentPrice = calculateDiscount(origPrice, campaign.discountPercent);
    }

    map[b.id] = {
      price: currentPrice,
      originalPrice: origPrice,
      discountRate: campaign?.discountPercent,
      badge: campaign?.badgeText
    };
  });

  return map;
};

export const PriceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeCampaign, setActiveCampaign] = useState<Campaign | null>(() => getActiveCampaign());
  const [prices, setPrices] = useState<Record<string, BookPrice>>(() => buildCurrentPrices(activeCampaign));
  const [isPriceModalOpen, setPriceModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Function to re-sync prices when campaign changes or manually triggered
  const refreshPrices = useCallback(() => {
    const currentCamp = getActiveCampaign();
    setActiveCampaign(currentCamp);
    const updated = buildCurrentPrices(currentCamp);

    // If local storage has admin overrides for this campaign, merge them
    try {
      const savedCampaign = localStorage.getItem('askar_active_campaign_id');
      const savedPrices = localStorage.getItem('askar_book_prices');

      if (savedCampaign === (currentCamp?.id || 'none') && savedPrices) {
        const parsed = JSON.parse(savedPrices);
        setPrices({ ...updated, ...parsed });
        return;
      }
    } catch {
      // Ignore parse errors
    }

    setPrices(updated);
  }, []);

  // Check for campaign transition periodically (every 15 seconds)
  useEffect(() => {
    const checkCampaignInterval = setInterval(() => {
      const nowCamp = getActiveCampaign();
      if (nowCamp?.id !== activeCampaign?.id) {
        setActiveCampaign(nowCamp);
        refreshPrices();
      }
    }, 15000);

    return () => clearInterval(checkCampaignInterval);
  }, [activeCampaign, refreshPrices]);

  // Sync with /api/prices if available on initial load
  useEffect(() => {
    let isMounted = true;
    const fetchServerPrices = async () => {
      try {
        const res = await fetch('/api/prices');
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.prices && Object.keys(data.prices).length > 0 && isMounted) {
            const currentCamp = getActiveCampaign();
            const basePrices = buildCurrentPrices(currentCamp);
            setPrices({ ...basePrices, ...data.prices });
          }
        }
      } catch {
        // Fallback to built-in default prices
      }
    };

    fetchServerPrices();
    return () => {
      isMounted = false;
    };
  }, []);

  // Keyboard shortcut for price editor: Ctrl + Shift + P
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        setPriceModalOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const getPrice = (bookId: string, fallbackPrice?: string, fallbackOriginalPrice?: string): BookPrice => {
    if (prices[bookId]) {
      return prices[bookId];
    }

    const origPrice = fallbackOriginalPrice || '250 ₺';
    const computedPrice = activeCampaign
      ? calculateDiscount(origPrice, activeCampaign.discountPercent)
      : fallbackPrice || '150 ₺';

    return {
      price: computedPrice,
      originalPrice: origPrice,
      discountRate: activeCampaign?.discountPercent,
      badge: activeCampaign?.badgeText
    };
  };

  const updatePrice = async (bookId: string, price: string, originalPrice?: string): Promise<boolean> => {
    setIsLoading(true);
    const newEntry: BookPrice = {
      price,
      originalPrice: originalPrice || prices[bookId]?.originalPrice || '250 ₺',
      discountRate: activeCampaign?.discountPercent,
      badge: activeCampaign?.badgeText
    };

    const updated = { ...prices, [bookId]: newEntry };
    setPrices(updated);

    try {
      localStorage.setItem('askar_active_campaign_id', activeCampaign?.id || 'none');
      localStorage.setItem('askar_book_prices', JSON.stringify(updated));

      // Attempt to save to backend /api/prices
      await fetch('/api/prices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prices: { [bookId]: { price, originalPrice: newEntry.originalPrice } } })
      });
    } catch {
      // Local storage fallback
    }

    setIsLoading(false);
    return true;
  };

  return (
    <PriceContext.Provider
      value={{
        prices,
        getPrice,
        updatePrice,
        activeCampaign,
        isPriceModalOpen,
        setPriceModalOpen,
        isLoading,
        refreshPrices
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
