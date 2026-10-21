import { apiClient } from '@/lib/api/client';
import type {
  FinancialReport,
  OrdersByStatusReport,
  ProductionParams,
  ProductionReport,
  ReportPeriod,
  SalesGroupBy,
  SalesReport,
  TopCustomersReport,
  TopCustomersSortBy,
  TopFlavorsReport,
  TopFlavorsSortBy,
} from '../types/reports';

export async function getSalesReport(
  params: ReportPeriod & { groupBy: SalesGroupBy },
): Promise<SalesReport> {
  const { data } = await apiClient.get<SalesReport>('/reports/sales', { params });
  return data;
}

export async function getProductionReport(
  params: ProductionParams,
): Promise<ProductionReport> {
  const { data } = await apiClient.get<ProductionReport>('/reports/production', {
    params,
  });
  return data;
}

export async function getOrdersByStatusReport(
  params: ReportPeriod,
): Promise<OrdersByStatusReport> {
  const { data } = await apiClient.get<OrdersByStatusReport>(
    '/reports/orders-by-status',
    { params },
  );
  return data;
}

export async function getTopFlavorsReport(
  params: ReportPeriod & { sortBy: TopFlavorsSortBy; limit?: number },
): Promise<TopFlavorsReport> {
  const { data } = await apiClient.get<TopFlavorsReport>('/reports/top-flavors', {
    params,
  });
  return data;
}

export async function getFinancialReport(params: ReportPeriod): Promise<FinancialReport> {
  const { data } = await apiClient.get<FinancialReport>('/reports/financial', { params });
  return data;
}

export async function getTopCustomersReport(
  params: ReportPeriod & { sortBy: TopCustomersSortBy; limit?: number },
): Promise<TopCustomersReport> {
  const { data } = await apiClient.get<TopCustomersReport>('/reports/top-customers', {
    params,
  });
  return data;
}
