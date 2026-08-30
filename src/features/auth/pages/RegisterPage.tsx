import { Anchor, Button, Stack, Text, TextInput } from '@mantine/core';
import { schemaResolver, useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useMutation } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { AuthSplitLayout } from '@/shared/components/Auth/AuthSplitLayout';
import { textColor } from '@/theme/colors';
import { registerCustomer } from '../api/authApi';
import { registerSchema, type RegisterFormValues } from '../types';
import { getApiErrorMessage } from '@/lib/api/errors';
import { PhoneInput } from '@/shared/components/PhoneInput/PhoneInput';

export function RegisterPage() {
  const navigate = useNavigate();

  const form = useForm<RegisterFormValues>({
    initialValues: { name: '', email: '', phone: '' },
    validate: schemaResolver(registerSchema),
  });

  const register = useMutation({
    mutationFn: registerCustomer,
    onSuccess: () => {
      notifications.show({
        color: 'accepted',
        title: 'Cadastro realizado!',
        message: 'Agora é só entrar com o código enviado por e-mail.',
      });
      navigate('/login', { state: { email: form.values.email } });
    },
    onError: (error) =>
      notifications.show({
        color: 'rejected.7',
        title: 'Não foi possível concluir o cadastro',
        message: getApiErrorMessage(
          error,
          'Verifique os dados informados e tente novamente.',
        ),
      }),
  });

  return (
    <AuthSplitLayout
      heading="Crie sua conta!"
      description="Crie sua conta para montar seus bolos, acompanhar pedidos e muito mais."
      illustrationSrc="/illustrations/cake-hero.png"
      illustrationAlt="Ilustração de um bolo decorado"
      formTitle="Cadastrar-se"
      formSubtitle="Preencha seus dados para criar sua conta."
    >
      <form onSubmit={form.onSubmit((values) => register.mutate(values))}>
        <Stack gap="lg">
          <TextInput
            label="Nome completo"
            placeholder="Digite seu nome completo"
            key={form.key('name')}
            {...form.getInputProps('name')}
          />
          <TextInput
            label="E-mail"
            placeholder="email@email.com"
            key={form.key('email')}
            {...form.getInputProps('email')}
          />
          <PhoneInput
            label="Telefone"
            placeholder="(99) 99999-9999"
            key={form.key('phone')}
            {...form.getInputProps('phone')}
          />
          <Button
            type="submit"
            loading={register.isPending}
            fullWidth
            color="plum.6"
            radius="sm"
            mt="xs"
          >
            Cadastrar-se
          </Button>

          <Text mt="sm" ta="center" size="sm" c={textColor}>
            Já tem conta?{' '}
            <Anchor component={Link} to="/login" c="plum.6" fw={700} underline="hover">
              Entrar
            </Anchor>
          </Text>
        </Stack>
      </form>
    </AuthSplitLayout>
  );
}
