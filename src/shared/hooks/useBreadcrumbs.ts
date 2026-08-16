import { matchPath, useLocation } from 'react-router-dom';
import type { BreadcrumbItem } from '@/shared/components/Layout/Breadcrumbs';

interface BreadcrumbRoute {
  pattern: string;
  label: string;
}

const CLIENT_BREADCRUMB_ROUTES: BreadcrumbRoute[] = [
  { pattern: '/', label: 'Meus pedidos' },
  { pattern: '/pedidos/novo', label: 'Novo pedido' },
  { pattern: '/pedidos/novo/carrinho', label: 'Carrinho' },
  { pattern: '/pedidos/novo/resumo', label: 'Resumo do pedido' },
  { pattern: '/pedidos/:orderId', label: 'Detalhe do pedido' },
];

const ADMIN_BREADCRUMB_ROUTES: BreadcrumbRoute[] = [
  { pattern: '/admin', label: 'Dashboard' },
  { pattern: '/admin/pedidos/novo', label: 'Novo pedido' },
  { pattern: '/admin/pedidos/:orderId', label: 'Detalhe do pedido' },
  { pattern: '/admin/pedidos/:orderId/editar', label: 'Editar pedido' },
  { pattern: '/admin/clientes', label: 'Clientes' },
  { pattern: '/admin/clientes/:customerId', label: 'Detalhe do cliente' },
  { pattern: '/admin/calendario', label: 'Calendário' },
  { pattern: '/admin/calendario/dias/:date', label: 'Pedidos do dia' },
  { pattern: '/admin/calendario/bloqueios/novo', label: 'Criar bloqueio' },
  { pattern: '/admin/calendario/bloqueios/:blockId', label: 'Editar bloqueio' },
  { pattern: '/admin/recheios', label: 'Recheios' },
  { pattern: '/admin/recheios/novo', label: 'Cadastrar recheio' },
  { pattern: '/admin/recheios/:flavorId', label: 'Editar recheio' },
  { pattern: '/admin/notificacoes', label: 'Notificações' },
  { pattern: '/admin/notificacoes/:typeId', label: 'Editor de notificação' },
];

function buildTrail(pathname: string, routes: BreadcrumbRoute[]): BreadcrumbItem[] {
  const segments = pathname.split('/').filter(Boolean);
  const trail: BreadcrumbItem[] = [];

  for (let i = 0; i <= segments.length; i += 1) {
    const path = i === 0 ? '/' : `/${segments.slice(0, i).join('/')}`;
    const route = routes.find((r) => matchPath({ path: r.pattern, end: true }, path));
    if (route) {
      trail.push({ label: route.label, href: path });
    }
  }

  return trail;
}

export function useClientBreadcrumbs(): BreadcrumbItem[] {
  const { pathname } = useLocation();
  return buildTrail(pathname, CLIENT_BREADCRUMB_ROUTES);
}

export function useAdminBreadcrumbs(): BreadcrumbItem[] {
  const { pathname } = useLocation();
  return buildTrail(pathname, ADMIN_BREADCRUMB_ROUTES);
}
