import { AppShell, NavLink, Stack } from '@mantine/core';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Calendar, Cake, Bell } from 'lucide-react';

const NAV_ITEMS = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/clientes', label: 'Clientes', icon: Users },
  { to: '/admin/calendario', label: 'Calendário', icon: Calendar },
  { to: '/admin/recheios', label: 'Recheios', icon: Cake },
  { to: '/admin/notificacoes', label: 'Notificações', icon: Bell },
] as const;

export function AdminLayout() {
  const location = useLocation();

  return (
    <AppShell>
      <AppShell.Header></AppShell.Header>
      <AppShell.Navbar p="md">
        <Stack gap={4}>
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              component={Link}
              to={to}
              label={label}
              leftSection={<Icon size={18} />}
              active={location.pathname === to}
            />
          ))}
        </Stack>
      </AppShell.Navbar>
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
