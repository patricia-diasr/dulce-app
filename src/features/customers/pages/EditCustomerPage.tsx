import { Container, Skeleton, Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { getApiErrorMessage } from '@/lib/api/errors';
import { getCustomer, updateCustomer } from '../api/customersApi';
import { CustomerForm } from '../components/CustomerForm';
import type { CustomerFormValues } from '../types/form';
import { formatPhoneNumber } from '@/shared/utils/phone';

export function EditCustomerPage() {
  const { customerId } = useParams<{ customerId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const customerIdNumber = Number(customerId);
  const hasValidCustomerId = Number.isInteger(customerIdNumber) && customerIdNumber > 0;

  const { data: customer, isLoading } = useQuery({
    queryKey: ['admin', 'customers', customerIdNumber],
    queryFn: () => getCustomer(customerIdNumber),
    enabled: hasValidCustomerId,
  });

  const updateMutation = useMutation({
    mutationFn: (values: CustomerFormValues) => updateCustomer(customerIdNumber, values),
    onSuccess: () => {
      notifications.show({
        color: 'accepted',
        title: 'Cliente atualizado!',
        message: 'As alterações foram salvas.',
      });
      queryClient.invalidateQueries({ queryKey: ['admin', 'customers'] });
      navigate('/admin/clientes');
    },
    onError: (error) =>
      notifications.show({
        color: 'rejected.7',
        title: 'Não foi possível salvar',
        message: getApiErrorMessage(
          error,
          'Verifique os dados informados e tente novamente.',
        ),
      }),
  });

  if (isLoading) {
    return (
      <Container size="md" py="xl">
        <Skeleton height={340} radius="md" />
      </Container>
    );
  }

  if (!customer) {
    return (
      <Container size="md" py="xl">
        <Text c="rejected">Cliente não encontrado.</Text>
      </Container>
    );
  }

  const initialValues: CustomerFormValues = {
    name: customer.name,
    phone: formatPhoneNumber(customer.phone),
    email: customer.email ?? '',
    notes: customer.notes ?? '',
  };

  return (
    <Container size="md" py="xl">
      <CustomerForm
        initialValues={initialValues}
        onSubmit={(values) => updateMutation.mutate(values)}
        onCancel={() => navigate('/admin/clientes')}
        title="Editar cliente"
        description="Atualize os dados deste cliente."
        submitting={updateMutation.isPending}
        submitLabel="Salvar alterações"
      />
    </Container>
  );
}
