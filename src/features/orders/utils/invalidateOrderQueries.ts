import type { QueryClient } from '@tanstack/react-query';

export function invalidateOrderQueries(
  queryClient: QueryClient,
  includeCustomer = false,
) {
  const queryKeys: readonly unknown[][] = [
    ['admin', 'orders'],
    ['admin', 'dashboard'],
    ['admin', 'calendar'],
    ['admin', 'reports'],
  ];

  return Promise.all([
    ...queryKeys.map((queryKey) => queryClient.invalidateQueries({ queryKey })),
    ...(includeCustomer
      ? [queryClient.invalidateQueries({ queryKey: ['customer', 'me'] })]
      : []),
  ]);
}
