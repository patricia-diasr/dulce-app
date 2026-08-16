import { AppShell, Box, NavLink, Stack } from '@mantine/core';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Calendar, Cake, Bell } from 'lucide-react';
import { PortalHeader } from '@/shared/components/Layout/PortalHeader';
import { MAX_CONTENT_WIDTH } from '@/theme/layout';
import { Breadcrumbs } from './Breadcrumbs';
import { useAdminBreadcrumbs } from '@/shared/hooks/useBreadcrumbs';

const NAV_ITEMS = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/clientes', label: 'Clientes', icon: Users },
  { to: '/admin/calendario', label: 'Calendário', icon: Calendar },
  { to: '/admin/recheios', label: 'Recheios', icon: Cake },
  { to: '/admin/notificacoes', label: 'Notificações', icon: Bell },
] as const;

export function AdminLayout() {
  const location = useLocation();
  const breadcrumbs = useAdminBreadcrumbs();

  return (
    <AppShell
      header={{ height: 64 }}
      navbar={{ width: 240, breakpoint: 'sm' }}
      padding="md"
    >
      <AppShell.Header>
        <PortalHeader userName="Patrícia" showMenuButton onMenuClick={() => {}} />
        <Breadcrumbs items={breadcrumbs} />
      </AppShell.Header>
      <AppShell.Navbar p="md" display="none">
        <Stack gap={4}>
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              component={Link}
              to={to}
              label={label}
              leftSection={<Icon size={18} />}
              active={location.pathname === to}
              variant="light"
            />
          ))}
        </Stack>
      </AppShell.Navbar>
      <AppShell.Main>
        <Box maw={MAX_CONTENT_WIDTH} mx="auto">
          <Outlet />
        </Box>
      </AppShell.Main>
    </AppShell>
  );
}
