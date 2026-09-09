import { createBrowserRouter } from 'react-router-dom';
import { ClientLayout } from '@/shared/components/Layout/ClientLayout';
import { AdminLayout } from '@/shared/components/Layout/AdminLayout';

import { LoginPage } from '@/features/auth/pages/LoginPage';
import { RegisterPage } from '@/features/auth/pages/RegisterPage';
import { AdminLoginPage } from '@/features/auth/pages/AdminLoginPage';

import { OrdersHomePage } from '@/features/orders/pages/OrdersHomePage';
import { NewOrderPage } from '@/features/orders/pages/NewOrderPage';
import { CartPage } from '@/features/orders/pages/CartPage';
import { OrderDetailPage } from '@/features/orders/pages/OrderDetailPage';
import { AdminDashboardPage } from '@/features/orders/pages/AdminDashboardPage';
import { AdminNewOrderPage } from '@/features/orders/pages/AdminNewOrderPage';
import { AdminOrderDetailPage } from '@/features/orders/pages/AdminOrderDetailPage';
import { AdminOrderEditPage } from '@/features/orders/pages/AdminOrderEditPage';

import { CustomersListPage } from '@/features/customers/pages/CustomersListPage';
import { CreateCustomerPage } from '@/features/customers/pages/CreateCustomerPage';
import { EditCustomerPage } from '@/features/customers/pages/EditCustomerPage';
import { CustomerDetailPage } from '@/features/customers/pages/CustomerDetailPage';

import { CalendarPage } from '@/features/schedule/pages/CalendarPage';
import { CreateBlockPage } from '@/features/schedule/pages/CreateBlockPage';
import { EditBlockPage } from '@/features/schedule/pages/EditBlockPage';
import { DayOrdersPage } from '@/features/schedule/pages/DayOrdersPage';

import { FlavorsListPage } from '@/features/flavors/pages/FlavorsListPage';
import { CreateFlavorPage } from '@/features/flavors/pages/CreateFlavorPage';
import { EditFlavorPage } from '@/features/flavors/pages/EditFlavorPage';

import { NotificationSettingsPage } from '@/features/notifications/pages/NotificationSettingsPage';
import { NotificationTemplateDetailPage } from '@/features/notifications/pages/NotificationTemplateDetailPage';

import { NotFoundPage } from '@/pages/errors/NotFoundPage';
import { RequireRole } from '@/shared/components/Auth/RequireRole';
import { AdminCartPage } from '@/features/orders/pages/AdminCartPage';

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  { path: '/cadastro', element: <RegisterPage /> },
  { path: '/admin/login', element: <AdminLoginPage /> },

  {
    path: '/',
    element: (
      <RequireRole role="CUSTOMER">
        <ClientLayout />
      </RequireRole>
    ),
    children: [
      { index: true, element: <OrdersHomePage /> },
      { path: 'pedidos/novo', element: <NewOrderPage /> },
      { path: 'pedidos/novo/carrinho', element: <CartPage /> },
      { path: 'pedidos/:orderId', element: <OrderDetailPage /> },
    ],
  },

  {
    path: '/admin',
    element: (
      <RequireRole role="ADMIN">
        <AdminLayout />
      </RequireRole>
    ),
    children: [
      { index: true, element: <AdminDashboardPage /> },

      { path: 'pedidos/novo', element: <AdminNewOrderPage /> },
      { path: 'pedidos/novo/carrinho', element: <AdminCartPage /> },
      { path: 'pedidos/:orderId', element: <AdminOrderDetailPage /> },
      { path: 'pedidos/:orderId/editar', element: <AdminOrderEditPage /> },

      { path: 'clientes', element: <CustomersListPage /> },
      { path: 'clientes/novo', element: <CreateCustomerPage /> },
      { path: 'clientes/:customerId', element: <CustomerDetailPage /> },
      { path: 'clientes/:customerId/editar', element: <EditCustomerPage /> },

      { path: 'calendario', element: <CalendarPage /> },
      { path: 'calendario/dias/:date', element: <DayOrdersPage /> },
      { path: 'calendario/bloqueios/novo', element: <CreateBlockPage /> },
      { path: 'calendario/bloqueios/:blockId', element: <EditBlockPage /> },

      { path: 'recheios', element: <FlavorsListPage /> },
      { path: 'recheios/novo', element: <CreateFlavorPage /> },
      { path: 'recheios/:flavorId', element: <EditFlavorPage /> },

      { path: 'notificacoes', element: <NotificationSettingsPage /> },
      { path: 'notificacoes/:typeId', element: <NotificationTemplateDetailPage /> },
    ],
  },

  { path: '*', element: <NotFoundPage /> },
]);
