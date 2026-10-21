import { matchPath, useLocation } from 'react-router-dom';
import type { BreadcrumbItem } from '@/shared/components/Layout/Breadcrumbs';

export interface AdminBreadcrumbState {
  breadcrumbTrail?: BreadcrumbItem[];
}

interface BreadcrumbRoute {
  pattern: string;
  label: string;
}

const CLIENT_BREADCRUMB_ROUTES: BreadcrumbRoute[] = [
  { pattern: '/', label: 'Meus pedidos' },
  { pattern: '/pedidos/novo', label: 'Novo pedido' },
  { pattern: '/pedidos/novo/carrinho', label: 'Carrinho' },
  { pattern: '/pedidos/:orderId', label: 'Detalhe do pedido' },
  { pattern: '/pedidos/:orderId/editar', label: 'Editar pedido' },
  { pattern: '/pedidos/:orderId/editar/bolo', label: 'Formulário do bolo' },
];

const ADMIN_BREADCRUMB_ROUTES: BreadcrumbRoute[] = [
  { pattern: '/admin', label: 'Dashboard' },
  { pattern: '/admin/pedidos', label: 'Pedidos' },
  { pattern: '/admin/pedidos/novo', label: 'Novo pedido' },
  { pattern: '/admin/pedidos/novo/carrinho', label: 'Carrinho' },
  { pattern: '/admin/pedidos/:orderId', label: 'Detalhe do pedido' },
  { pattern: '/admin/pedidos/:orderId/editar', label: 'Editar pedido' },
  { pattern: '/admin/pedidos/:orderId/editar/bolo', label: 'Formulário do bolo' },
  { pattern: '/admin/clientes', label: 'Clientes' },
  { pattern: '/admin/clientes/novo', label: 'Cadastrar cliente' },
  { pattern: '/admin/clientes/:customerId', label: 'Detalhe do cliente' },
  { pattern: '/admin/clientes/:customerId/editar', label: 'Editar cliente' },
  { pattern: '/admin/calendario', label: 'Calendário' },
  { pattern: '/admin/calendario/dias/:date', label: 'Pedidos do dia' },
  { pattern: '/admin/calendario/bloqueios/novo', label: 'Criar bloqueio' },
  { pattern: '/admin/calendario/bloqueios/:blockId', label: 'Editar bloqueio' },
  { pattern: '/admin/relatorios', label: 'Relatórios' },
  { pattern: '/admin/recheios', label: 'Recheios' },
  { pattern: '/admin/recheios/novo', label: 'Cadastrar recheio' },
  { pattern: '/admin/recheios/:flavorId', label: 'Editar recheio' },
  { pattern: '/admin/notificacoes', label: 'Notificações' },
  { pattern: '/admin/notificacoes/:typeId', label: 'Editar notificação' },
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
  const { pathname, state } = useLocation();
  const routeTrail = buildTrail(pathname, ADMIN_BREADCRUMB_ROUTES);
  const navigationState = state as AdminBreadcrumbState | null;
  const breadcrumbTrail = navigationState?.breadcrumbTrail;
  const orderId =
    matchPath('/admin/pedidos/:orderId', pathname)?.params.orderId ??
    matchPath('/admin/pedidos/:orderId/editar', pathname)?.params.orderId ??
    matchPath('/admin/pedidos/:orderId/editar/bolo', pathname)?.params.orderId;
  const isOrderDetailRoute = Boolean(orderId && /^\d+$/.test(orderId));
  const isNewOrderRoute = Boolean(
    matchPath('/admin/pedidos/novo', pathname) ||
    matchPath('/admin/pedidos/novo/carrinho', pathname),
  );
  const isCustomerEditRoute = Boolean(
    matchPath('/admin/clientes/:customerId/editar', pathname),
  );
  const isScheduleBlockRoute = Boolean(
    matchPath('/admin/calendario/bloqueios/novo', pathname) ||
    matchPath('/admin/calendario/bloqueios/:blockId', pathname),
  );

  let routeContextStart = -1;
  if (isOrderDetailRoute) {
    routeContextStart = routeTrail.findIndex(
      ({ href }) => href !== undefined && matchPath('/admin/pedidos/:orderId', href),
    );
  } else if (isNewOrderRoute) {
    routeContextStart = routeTrail.findIndex(
      ({ href }) => href === '/admin/pedidos/novo',
    );
  } else if (isCustomerEditRoute || isScheduleBlockRoute) {
    routeContextStart = routeTrail.length - 1;
  }

  if (
    Array.isArray(breadcrumbTrail) &&
    breadcrumbTrail.length > 0 &&
    routeContextStart >= 0
  ) {
    return [...breadcrumbTrail, ...routeTrail.slice(routeContextStart)];
  }

  return routeTrail;
}
