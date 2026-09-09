import { useCallback, useEffect, useState } from 'react';
import type { Flavor } from '@/features/flavors/types';
import type { CakeFormValues } from '../types/cake';

export interface CartItem {
  id: string;
  cake: CakeFormValues;
  flavor: Flavor;
}

interface CartCustomer {
  id: number;
  name: string;
  phone: string;
}

interface CartState {
  items: CartItem[];
  pickupDate: string | null;
  pickupTime: string | null;
  discount: number | null;
  notes: string | null;
  customer: CartCustomer | null;
}

const EMPTY_STATE: CartState = {
  items: [],
  pickupDate: null,
  pickupTime: null,
  discount: null,
  notes: null,
  customer: null,
};

function storageKey(cartId: string) {
  return `dulce:cart:${cartId}`;
}

function readCart(cartId: string): CartState {
  try {
    const raw = sessionStorage.getItem(storageKey(cartId));
    return raw ? { ...EMPTY_STATE, ...JSON.parse(raw) } : EMPTY_STATE;
  } catch {
    return EMPTY_STATE;
  }
}

export function useOrderCart(cartId: string) {
  const [state, setState] = useState<CartState>(() => readCart(cartId));

  useEffect(() => {
    sessionStorage.setItem(storageKey(cartId), JSON.stringify(state));
  }, [cartId, state]);

  const addItem = useCallback((cake: CakeFormValues, flavor: Flavor) => {
    setState((prev) => ({
      ...prev,
      items: [...prev.items, { id: crypto.randomUUID(), cake, flavor }],
    }));
  }, []);

  const updateItem = useCallback((id: string, cake: CakeFormValues, flavor: Flavor) => {
    setState((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.id === id ? { ...item, cake, flavor } : item,
      ),
    }));
  }, []);

  const removeItem = useCallback((id: string) => {
    setState((prev) => ({ ...prev, items: prev.items.filter((item) => item.id !== id) }));
  }, []);

  const setCustomer = useCallback((customer: CartCustomer | null) => {
    setState((prev) => ({ ...prev, customer }));
  }, []);

  const setPickup = useCallback((date: string | null, time: string | null) => {
    setState((prev) => ({ ...prev, pickupDate: date, pickupTime: time }));
  }, []);

  const setDiscount = useCallback((discount: number | null) => {
    setState((prev) => ({ ...prev, discount }));
  }, []);

  const setNotes = useCallback((notes: string | null) => {
    setState((prev) => ({ ...prev, notes }));
  }, []);

  const clear = useCallback(() => {
    setState(EMPTY_STATE);
    sessionStorage.removeItem(storageKey(cartId));
  }, [cartId]);

  return {
    ...state,
    addItem,
    updateItem,
    removeItem,
    setPickup,
    setDiscount,
    setNotes,
    setCustomer,
    clear,
  };
}
