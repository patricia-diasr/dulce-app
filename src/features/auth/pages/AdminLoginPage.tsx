import { Button, PasswordInput, Stack, TextInput } from '@mantine/core';
import { AuthSplitLayout } from '@/shared/components/Auth/AuthSplitLayout';

export function AdminLoginPage() {
  return (
    <AuthSplitLayout
      heading="Bem-vindo de volta!"
      description="Acesse sua conta para gerenciar e acompanhar pedidos."
      illustrationSrc="/illustrations/cake-hero.png"
      illustrationAlt="Ilustração de um bolo decorado"
      formTitle="Entrar na sua conta"
      formSubtitle="Preencha seus dados para criar sua conta."
    >
      <Stack gap="lg">
        <TextInput
          label="E-mail"
          placeholder="email@email.com"
          radius="sm"
        />
        <PasswordInput
          label="Senha"
          placeholder="Insira sua senha"
          radius="sm"
        />
        <Button fullWidth color="plum" radius="sm" mt="lg">
          Entrar
        </Button>
      </Stack>
    </AuthSplitLayout>
  );
}
