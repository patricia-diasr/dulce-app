import { OrderCakeBuilder } from '../components/OrderCakeBuilder';

export function NewOrderPage() {
  return <OrderCakeBuilder mode="customer" cartId="customer-new-order" />;
}
