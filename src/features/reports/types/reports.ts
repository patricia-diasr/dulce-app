import type { InvoiceStatus, OrderStatus } from '@/features/orders/types/order';
import type { CakeBase } from '@/shared/utils/cakeBase';

export interface ReportPeriod {
  from: string;
  to: string;
}

export type SalesGroupBy = 'day' | 'week' | 'month';

export interface SalesMetrics {
  ordersCount: number;
  itemsCount: number;
  totalKg: number;
  grossAmount: number;
  discountAmount: number;
  netAmount: number;
  averageTicket: number;
}

export interface SalesSeriesPoint extends SalesMetrics {
  periodStart: string;
}

export interface SalesReport {
  from: string;
  to: string;
  groupBy: SalesGroupBy;
  summary: SalesMetrics;
  series: SalesSeriesPoint[];
}

export interface ProductionSizeBreakdown {
  sizeId: number;
  sizeName: string;
  weightKg: number;
  quantity: number;
  totalKg: number;
}

export interface ProductionLine {
  flavorId: number | null;
  finish: CakeBase | null;
  label: string;
  cakesCount: number;
  totalKg: number;
  bySize: ProductionSizeBreakdown[];
}

export interface ProductionCombination {
  flavorName: string;
  sizeName: string;
  cakeBase: CakeBase;
  topping: CakeBase;
  quantity: number;
  totalKg: number;
}

export interface ProductionBlock {
  ordersCount: number;
  cakesCount: number;
  totalKg: number;
  byFlavor: ProductionLine[];
  byCakeBase: ProductionLine[];
  byTopping: ProductionLine[];
  combinations: ProductionCombination[];
}

export interface ProductionDay extends ProductionBlock {
  date: string;
}

export interface ProductionReport {
  from: string;
  to: string;
  totals: ProductionBlock;
  days: ProductionDay[];
}

export interface ProductionParams {
  date?: string;
  from?: string;
  to?: string;
}

export interface OrdersByStatusItem {
  status: OrderStatus;
  ordersCount: number;
  netAmount: number;
}

export interface OrdersByStatusReport {
  from: string;
  to: string;
  total: { ordersCount: number; netAmount: number };
  byStatus: OrdersByStatusItem[];
}

export type TopFlavorsSortBy = 'revenue' | 'cakes' | 'kg';

export interface TopFlavorItem {
  flavorId: number;
  name: string;
  active: boolean;
  cakesCount: number;
  totalKg: number;
  grossRevenue: number;
}

export interface TopFlavorsReport {
  from: string;
  to: string;
  sortBy: TopFlavorsSortBy;
  items: TopFlavorItem[];
}

export interface FinancialStatusItem {
  status: InvoiceStatus;
  ordersCount: number;
  due: number;
  received: number;
  pending: number;
}

export interface PendingCompletedOrder {
  orderId: number;
  customerId: number;
  customerName: string;
  customerPhone: string;
  pickupAt: string;
  completedAt: string;
  netAmount: number;
  amountPaid: number;
  balance: number;
}

export interface FinancialReport {
  from: string;
  to: string;
  summary: {
    ordersCount: number;
    totalDue: number;
    totalReceived: number;
    totalPending: number;
  };
  byInvoiceStatus: FinancialStatusItem[];
  pendingCompletedOrdersCount: number;
  pendingCompletedOrders: PendingCompletedOrder[];
  refunds: { ordersCount: number; totalAmount: number };
}

export type TopCustomersSortBy = 'revenue' | 'orders' | 'kg';

export interface TopCustomerItem {
  customerId: number;
  name: string;
  phone: string;
  email: string | null;
  ordersCount: number;
  totalKg: number;
  netAmount: number;
}

export interface TopCustomersReport {
  from: string;
  to: string;
  sortBy: TopCustomersSortBy;
  items: TopCustomerItem[];
}
