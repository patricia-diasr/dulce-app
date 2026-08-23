import { useEffect, useState } from 'react';
import { Anchor, Button, PinInput, Stack, Text, TextInput } from '@mantine/core';
import { Link } from 'react-router-dom';
import { AuthSplitLayout } from '@/shared/components/Auth/AuthSplitLayout';
import { textColor } from '@/theme/colors';

const RESEND_SECONDS = 30;

export function LoginPage() {
  const [step, setStep] = useState<'email' | 'code'>('email');
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);

  useEffect(() => {
    if (step !== 'code' || secondsLeft === 0) return;
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [step, secondsLeft]);

  function handleSendCode() {
    setSecondsLeft(RESEND_SECONDS);
    setStep('code');
  }

  function handleResend() {
    setSecondsLeft(RESEND_SECONDS);
  }

  return (
    <AuthSplitLayout
      heading="Bem-vindo de volta!"
      description="Acesse sua conta para acompanhar seus pedidos, realizar novos pedidos, e muito mais."
      illustrationSrc="/illustrations/cake-hero.png"
      illustrationAlt="Ilustração de um bolo decorado"
      formTitle={step === 'email' ? 'Entrar na sua conta' : 'Digite o código recebido'}
      formSubtitle={
        step === 'email'
          ? 'Informe seu e-mail para receber um código de verificação.'
          : 'Insira o código de verificação recebido para realizar login.'
      }
    >
      {step === 'email' ? (
        <Stack gap="lg">
          <TextInput
            label="E-mail"
            placeholder="email@email.com"
            radius="sm"
          />
          <Button fullWidth color="plum" radius="sm" mt="xs" onClick={handleSendCode}>
            Enviar código
          </Button>

          <Text mt="sm" ta="center" size="sm" c={textColor}>
            Não tem conta?{' '}
            <Anchor
              component={Link}
              to="/cadastro"
              c="lilac.6"
              fw={700}
              underline="hover"
            >
              Cadastre-se
            </Anchor>
          </Text>
        </Stack>
      ) : (
        <Stack gap="lg">
          <PinInput
            length={6}
            type="number"
            oneTimeCode
            size="md"
            radius="sm"
            classNames={{ input: 'dulce-auth-input' }}
            styles={{ root: { justifyContent: 'space-between' } }}
          />
          <Button fullWidth color="plum" radius="sm" mt="xs">
            Entrar
          </Button>

          <Text mt="sm" ta="center" size="sm" c={textColor}>
            Não recebeu o código?{' '}
            {secondsLeft > 0 ? (
              <Text component="span" c="dimmed">
                Reenviar em 0:{secondsLeft.toString().padStart(2, '0')}
              </Text>
            ) : (
              <Anchor
                component="button"
                type="button"
                onClick={handleResend}
                c="lilac.6"
                fw={700}
                underline="hover"
              >
                Reenviar código
              </Anchor>
            )}
          </Text>
        </Stack>
      )}
    </AuthSplitLayout>
  );
}
