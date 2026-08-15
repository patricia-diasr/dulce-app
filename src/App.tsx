import { MantineProvider } from '@mantine/core';
import { DatesProvider } from '@mantine/dates';
import { Notifications } from '@mantine/notifications';
import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import { queryClient } from './app/queryClient';
import { router } from './app/router';
import { theme } from './theme/theme';

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={theme} defaultColorScheme="light">
        <DatesProvider settings={{ locale: 'pt-br' }}>
          <Notifications position="top-right" />
          <RouterProvider router={router} />
        </DatesProvider>
      </MantineProvider>
    </QueryClientProvider>
  );
}
