import { AppShell } from '@mantine/core';
import { Outlet } from 'react-router-dom';

export function ClientLayout() {
  return (
    <AppShell>
      <AppShell.Header></AppShell.Header>
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
