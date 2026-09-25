import { useParams } from 'react-router-dom';
import { OrderCakeBuilder } from '../components/OrderCakeBuilder';

export function OrderEditCakePage() {
  const { orderId } = useParams<{ orderId: string }>();
  const editPath = `/pedidos/${orderId}/editar`;

  return (
    <OrderCakeBuilder
      mode="customer"
      cartId={`customer-order-edit-${orderId}`}
      cancelPath={editPath}
      cartPath={editPath}
    />
  );
}
