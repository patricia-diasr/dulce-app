import { AppShell, Box, NavLink, Stack, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Calendar, Cake, Bell } from 'lucide-react';
import { Breadcrumbs } from '@/shared/components/Layout/Breadcrumbs';
import { PortalHeader } from '@/shared/components/Layout/PortalHeader';
import { useAdminBreadcrumbs } from '@/shared/hooks/useBreadcrumbs';
import { creamBackground } from '@/theme/colors';
import { MAX_CONTENT_WIDTH } from '@/theme/layout';

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
  const [navOpened, { toggle: toggleNav }] = useDisclosure(false);

  return (
    <AppShell
      header={{ height: 64 }}
      navbar={{
        width: 240,
        breakpoint: 'sm',
        collapsed: { desktop: !navOpened, mobile: !navOpened },
      }}
      padding="md"
    >
      <AppShell.Header style={{ borderBottom: 'none' }}>
        <PortalHeader userName="Patrícia" showMenuButton onMenuClick={toggleNav} />
        <Breadcrumbs items={breadcrumbs} />
      </AppShell.Header>

      <AppShell.Navbar
        p="md"
        bg="plum.8"
        style={{ borderTop: '1px solid rgba(209, 186, 163, 0.25)' }}
      >
        <Stack gap={4}>
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => {
            const isActive = location.pathname === to;

            return (
              <NavLink
                key={to}
                component={Link}
                to={to}
                active={isActive}
                variant="subtle"
                className="dulce-chrome-hover"
                style={{ borderRadius: 'var(--mantine-radius-sm)' }}
                leftSection={<Icon size={18} color={creamBackground} />}
                label={
                  <Text c={creamBackground} fw={isActive ? 700 : 500} size="sm">
                    {label}
                  </Text>
                }
                vars={() => ({
                  root: { '--nl-bg': 'rgba(251, 247, 244, 0.22)' },
                  children: {},
                })}
              />
            );
          })}
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
