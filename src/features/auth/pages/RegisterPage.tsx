import { Anchor, Button, Stack, Text, TextInput } from '@mantine/core';
import { Link } from 'react-router-dom';
import { AuthSplitLayout } from '@/shared/components/Auth/AuthSplitLayout';
import { textColor } from '@/theme/colors';

export function RegisterPage() {
  return (
    <AuthSplitLayout
      heading="Crie sua conta!"
      description="Crie sua conta para montar seus bolos, acompanhar pedidos e muito mais."
      illustrationSrc="/illustrations/cake-hero.png"
      illustrationAlt="Ilustração de um bolo decorado"
      formTitle="Cadastrar-se"
      formSubtitle="Preencha seus dados para criar sua conta."
    >
      <Stack gap="lg">
        <TextInput
          label="Nome completo"
          placeholder="Digite seu nome completo"
          radius="sm"
        />
        <TextInput
          label="E-mail"
          placeholder="email@email.com"
          radius="sm"
        />
        <TextInput
          label="Telefone"
          placeholder="(99) 99999-9999"
          radius="sm"
        />
        <Button fullWidth color="plum" radius="sm" mt="xs">
          Cadastrar-se
        </Button>

        <Text mt="sm" ta="center" size="sm" c={textColor}>
          Já tem conta?{' '}
          <Anchor component={Link} to="/login" c="lilac.6" fw={700} underline="hover">
            Entrar
          </Anchor>
        </Text>
      </Stack>
    </AuthSplitLayout>
  );
}
