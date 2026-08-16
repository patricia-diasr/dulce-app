import { AppShell, Box } from '@mantine/core';
import { Outlet } from 'react-router-dom';
import { PortalHeader } from '@/shared/components/Layout/PortalHeader';
import { MAX_CONTENT_WIDTH } from '@/theme/layout';

export function ClientLayout() {
  return (
    <AppShell header={{ height: 64 }} padding="md">
      <AppShell.Header>
        <PortalHeader userName="Patrícia" />
      </AppShell.Header>
      <AppShell.Main>
        <Box maw={MAX_CONTENT_WIDTH} mx="auto">
          <Outlet />
        </Box>
      </AppShell.Main>
    </AppShell>
  );
}
