import { AppShell, Box } from '@mantine/core';
import { Outlet } from 'react-router-dom';
import { PortalHeader } from '@/shared/components/Layout/PortalHeader';
import { MAX_CONTENT_WIDTH } from '@/theme/layout';
import { Breadcrumbs } from './Breadcrumbs';
import { useClientBreadcrumbs } from '@/shared/hooks/useBreadcrumbs';

export function ClientLayout() {
  const breadcrumbs = useClientBreadcrumbs();

  return (
    <AppShell header={{ height: 64 }} padding="md">
      <AppShell.Header>
        <PortalHeader userName="Patrícia" />
        <Breadcrumbs items={breadcrumbs} />
      </AppShell.Header>
      <AppShell.Main>
        <Box maw={MAX_CONTENT_WIDTH} mx="auto">
          <Outlet />
        </Box>
      </AppShell.Main>
    </AppShell>
  );
}
