import { useCallback, useEffect, useReducer } from 'react';
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

export interface CartState {
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

function readCart(cartId: string): CartState | null {
  try {
    const raw = sessionStorage.getItem(storageKey(cartId));
    return raw ? { ...EMPTY_STATE, ...JSON.parse(raw) } : null;
  } catch {
    return null;
  }
}

type CartAction =
  | { type: 'ADD_ITEM'; cake: CakeFormValues; flavor: Flavor }
  | { type: 'UPDATE_ITEM'; id: string; cake: CakeFormValues; flavor: Flavor }
  | { type: 'REMOVE_ITEM'; id: string }
  | { type: 'SET_PICKUP'; date: string | null; time: string | null }
  | { type: 'SET_DISCOUNT'; discount: number | null }
  | { type: 'SET_NOTES'; notes: string | null }
  | { type: 'SET_CUSTOMER'; customer: CartCustomer | null }
  | { type: 'CLEAR' };

function reducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM':
      return {
        ...state,
        items: [
          ...state.items,
          { id: crypto.randomUUID(), cake: action.cake, flavor: action.flavor },
        ],
      };
    case 'UPDATE_ITEM':
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.id
            ? { ...item, cake: action.cake, flavor: action.flavor }
            : item,
        ),
      };
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter((item) => item.id !== action.id) };
    case 'SET_PICKUP':
      return { ...state, pickupDate: action.date, pickupTime: action.time };
    case 'SET_DISCOUNT':
      return { ...state, discount: action.discount };
    case 'SET_NOTES':
      return { ...state, notes: action.notes };
    case 'SET_CUSTOMER':
      return { ...state, customer: action.customer };
    case 'CLEAR':
      return EMPTY_STATE;
    default:
      return state;
  }
}

export function useOrderCart(cartId: string, buildSeed?: () => CartState) {
  const [state, dispatch] = useReducer(
    reducer,
    cartId,
    (id) => readCart(id) ?? buildSeed?.() ?? EMPTY_STATE,
  );

  useEffect(() => {
    if (state === EMPTY_STATE) return;
    sessionStorage.setItem(storageKey(cartId), JSON.stringify(state));
  }, [cartId, state]);

  const addItem = useCallback(
    (cake: CakeFormValues, flavor: Flavor) =>
      dispatch({ type: 'ADD_ITEM', cake, flavor }),
    [],
  );
  const updateItem = useCallback(
    (id: string, cake: CakeFormValues, flavor: Flavor) =>
      dispatch({ type: 'UPDATE_ITEM', id, cake, flavor }),
    [],
  );
  const removeItem = useCallback(
    (id: string) => dispatch({ type: 'REMOVE_ITEM', id }),
    [],
  );
  const setPickup = useCallback(
    (date: string | null, time: string | null) =>
      dispatch({ type: 'SET_PICKUP', date, time }),
    [],
  );
  const setDiscount = useCallback(
    (discount: number | null) => dispatch({ type: 'SET_DISCOUNT', discount }),
    [],
  );
  const setNotes = useCallback(
    (notes: string | null) => dispatch({ type: 'SET_NOTES', notes }),
    [],
  );
  const setCustomer = useCallback(
    (customer: CartCustomer | null) => dispatch({ type: 'SET_CUSTOMER', customer }),
    [],
  );

  const clear = useCallback(() => {
    dispatch({ type: 'CLEAR' });
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
