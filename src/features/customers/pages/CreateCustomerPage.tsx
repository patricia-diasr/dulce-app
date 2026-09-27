import { Container } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { getApiErrorMessage } from '@/lib/api/errors';
import { createCustomer } from '../api/customersApi';
import { CustomerForm } from '../components/CustomerForm';
import type { CustomerFormValues } from '../types/form';

export function CreateCustomerPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: createCustomer,
    onSuccess: () => {
      notifications.show({
        color: 'accepted',
        title: 'Cliente cadastrado!',
        message: 'O novo cliente já está disponível na listagem.',
      });
      queryClient.invalidateQueries({ queryKey: ['admin', 'customers'] });
      navigate('/admin/clientes');
    },
    onError: (error) =>
      notifications.show({
        color: 'rejected.7',
        title: 'Não foi possível cadastrar',
        message: getApiErrorMessage(
          error,
          'Verifique os dados informados e tente novamente.',
        ),
      }),
  });

  const initialValues: CustomerFormValues = { name: '', phone: '', email: '', notes: '' };

  return (
    <Container size="md" py="xl">
      <CustomerForm
        initialValues={initialValues}
        onSubmit={(values) => createMutation.mutate(values)}
        onCancel={() => navigate('/admin/clientes')}
        title="Cadastrar cliente"
        description="Preencha os dados para cadastrar um cliente diretamente."
        submitting={createMutation.isPending}
        submitLabel="Cadastrar"
      />
    </Container>
  );
}
