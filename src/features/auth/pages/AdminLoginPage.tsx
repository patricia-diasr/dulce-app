import { Button, PasswordInput, Stack, TextInput } from '@mantine/core';
import { schemaResolver, useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { AuthSplitLayout } from '@/shared/components/Auth/AuthSplitLayout';
import { setToken } from '@/shared/utils/tokenStorage';
import { adminLogin } from '../api/authApi';
import { adminLoginSchema, type AdminLoginFormValues } from '../types';
import { getApiErrorMessage } from '@/lib/api/errors';

export function AdminLoginPage() {
  const navigate = useNavigate();

  const form = useForm<AdminLoginFormValues>({
    initialValues: { email: '', password: '' },
    validate: schemaResolver(adminLoginSchema),
  });

  const login = useMutation({
    mutationFn: adminLogin,
    onSuccess: ({ token, user, role, name }) => {
      setToken(token, user, role, name);
      navigate('/admin');
    },
    onError: (error) =>
      notifications.show({
        color: 'rejected.7',
        title: 'Não foi possível entrar',
        message: getApiErrorMessage(error, 'Confira o e-mail e a senha informados.'),
      }),
  });

  return (
    <AuthSplitLayout
      heading="Bem-vindo de volta!"
      description="Acesse sua conta para gerenciar e acompanhar pedidos."
      illustrationSrc="/illustrations/cake-hero.png"
      illustrationAlt="Ilustração de um bolo decorado"
      formTitle="Entrar na sua conta"
      formSubtitle="Preencha seus dados para acessar sua conta."
    >
      <form onSubmit={form.onSubmit((values) => login.mutate(values))}>
        <Stack gap="lg">
          <TextInput
            label="E-mail"
            placeholder="email@email.com"
            key={form.key('email')}
            {...form.getInputProps('email')}
          />
          <PasswordInput
            label="Senha"
            placeholder="Insira sua senha"
            key={form.key('password')}
            {...form.getInputProps('password')}
          />
          <Button
            type="submit"
            loading={login.isPending}
            fullWidth
            color="plum.6"
            radius="sm"
            mt="xs"
          >
            Entrar
          </Button>
        </Stack>
      </form>
    </AuthSplitLayout>
  );
}
