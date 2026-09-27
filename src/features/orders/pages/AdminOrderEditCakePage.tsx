import { useParams } from 'react-router-dom';
import { OrderCakeBuilder } from '../components/OrderCakeBuilder';

export function AdminOrderEditCakePage() {
  const { orderId } = useParams<{ orderId: string }>();
  const editPath = `/admin/pedidos/${orderId}/editar`;

  return (
    <OrderCakeBuilder
      mode="admin"
      cartId={`admin-order-edit-${orderId}`}
      cancelPath={editPath}
      cartPath={editPath}
    />
  );
}
