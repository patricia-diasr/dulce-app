import { Button, PasswordInput, Stack, TextInput } from '@mantine/core';
import { AuthSplitLayout } from '@/shared/components/Auth/AuthSplitLayout';
import { textColor } from '@/theme/colors';

const fieldStyles = {
  label: { fontWeight: 800, fontSize: 14, marginBottom: 6, color: textColor },
  input: { backgroundColor: '#FEFEFE' },
};
const fieldClassNames = { input: 'dulce-auth-input' };

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
          styles={fieldStyles}
          classNames={fieldClassNames}
        />
        <PasswordInput
          label="Senha"
          placeholder="Insira sua senha"
          radius="sm"
          styles={fieldStyles}
          classNames={fieldClassNames}
        />
        <Button fullWidth color="plum" radius="sm" mt="lg">
          Entrar
        </Button>
      </Stack>
    </AuthSplitLayout>
  );
}
