import type { QueryClient } from '@tanstack/react-query';

export function invalidateScheduleQueries(queryClient: QueryClient) {
  return queryClient.invalidateQueries({
    predicate: (query) =>
      query.queryKey[0] === 'schedule' ||
      (query.queryKey[0] === 'admin' &&
        (query.queryKey[1] === 'calendar' || query.queryKey[1] === 'schedule')),
  });
}
