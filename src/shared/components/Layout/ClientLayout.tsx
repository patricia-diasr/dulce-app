import { AppShell, Box } from '@mantine/core';
import { Outlet } from 'react-router-dom';
import { PortalHeader } from '@/shared/components/Layout/PortalHeader';
import { MAX_CONTENT_WIDTH } from '@/theme/layout';
import { Breadcrumbs } from './Breadcrumbs';
import { useClientBreadcrumbs } from '@/shared/hooks/useBreadcrumbs';
import { useLogout } from '@/shared/hooks/useLogout';
import { getName } from '@/shared/utils/tokenStorage';

export function ClientLayout() {
  const breadcrumbs = useClientBreadcrumbs();
  const handleLogout = useLogout('/login');

  return (
    <AppShell header={{ height: 64 }} padding="md">
      <AppShell.Header>
        <PortalHeader userName={getName() ?? ''} onLogout={handleLogout} />
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
