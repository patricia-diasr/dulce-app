import { Button, Stack } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { ComingSoon } from '@/shared/components/ComingSoon/ComingSoon';
import { getCustomer } from '../api/customersApi';

export function CustomerDetailPage() {
  const { customerId } = useParams<{ customerId: string }>();
  const navigate = useNavigate();

  const customerIdNumber = Number(customerId);
  const hasValidCustomerId = Number.isInteger(customerIdNumber) && customerIdNumber > 0;

  const { data: customer } = useQuery({
    queryKey: ['admin', 'customers', customerIdNumber],
    queryFn: () => getCustomer(customerIdNumber),
    enabled: hasValidCustomerId,
  });

  return (
    <Stack align="center" gap="lg">
      <ComingSoon
        title="Detalhe do cliente"
        description="Dados cadastrais e histórico completo de pedidos do cliente."
      />
      <Button
        color="plum.6"
        radius="sm"
        disabled={!customer}
        onClick={() =>
          navigate('/admin/pedidos/novo', {
            state: {
              customerId: customerIdNumber,
              customerName: customer?.name,
              customerPhone: customer?.phone,
            },
          })
        }
      >
        Adicionar pedido
      </Button>
    </Stack>
  );
}
