import { useEffect, useState } from 'react';
import { Anchor, Button, PinInput, Stack, Text, TextInput } from '@mantine/core';
import { schemaResolver, useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useMutation } from '@tanstack/react-query';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthSplitLayout } from '@/shared/components/Auth/AuthSplitLayout';
import { setToken } from '@/shared/utils/tokenStorage';
import { textColor } from '@/theme/colors';
import { requestCustomerLoginCode, verifyCustomerLoginCode } from '../api/authApi';
import {
  codeSchema,
  emailSchema,
  type CodeFormValues,
  type EmailFormValues,
} from '../types';
import { getApiErrorMessage } from '@/lib/api/errors';

const RESEND_SECONDS = 30;

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const prefilledEmail = (location.state as { email?: string } | null)?.email ?? '';

  const [step, setStep] = useState<'email' | 'code'>('email');
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);

  const emailForm = useForm<EmailFormValues>({
    initialValues: { email: prefilledEmail },
    validate: schemaResolver(emailSchema),
  });

  const codeForm = useForm<CodeFormValues>({
    initialValues: { code: '' },
    validate: schemaResolver(codeSchema),
  });

  useEffect(() => {
    if (step !== 'code' || secondsLeft === 0) return;
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [step, secondsLeft]);

  const requestCode = useMutation({
    mutationFn: (email: string) => requestCustomerLoginCode(email),
    onSuccess: () => {
      setSecondsLeft(RESEND_SECONDS);
      setStep('code');
    },
    onError: (error) =>
      notifications.show({
        color: 'rejected',
        title: 'Não foi possível enviar o código',
        message: getApiErrorMessage(
          error,
          'Verifique o e-mail informado e tente novamente.',
        ),
      }),
  });

  const verifyCode = useMutation({
    mutationFn: (code: string) => verifyCustomerLoginCode(emailForm.values.email, code),
    onSuccess: ({ token, role, name }) => {
      setToken(token, role, name);
      navigate('/');
    },
    onError: (error) =>
      notifications.show({
        color: 'rejected',
        title: 'Não foi possível entrar',
        message: getApiErrorMessage(
          error,
          'Confira o código enviado por e-mail e tente novamente.',
        ),
      }),
  });

  function handleResend() {
    setSecondsLeft(RESEND_SECONDS);
    requestCode.mutate(emailForm.values.email);
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
        <form onSubmit={emailForm.onSubmit((values) => requestCode.mutate(values.email))}>
          <Stack gap="lg">
            <TextInput
              label="E-mail"
              placeholder="email@email.com"
              key={emailForm.key('email')}
              {...emailForm.getInputProps('email')}
            />
            <Button
              type="submit"
              loading={requestCode.isPending}
              fullWidth
              color="plum.6"
              radius="sm"
              mt="xs"
            >
              Enviar código
            </Button>

            <Text mt="sm" ta="center" size="sm" c={textColor}>
              Não tem conta?{' '}
              <Anchor
                component={Link}
                to="/cadastro"
                c="plum.6"
                fw={700}
                underline="hover"
              >
                Cadastre-se
              </Anchor>
            </Text>
          </Stack>
        </form>
      ) : (
        <form onSubmit={codeForm.onSubmit((values) => verifyCode.mutate(values.code))}>
          <Stack gap="lg">
            <PinInput
              length={6}
              type="number"
              oneTimeCode
              size="md"
              styles={{ root: { justifyContent: 'space-between' } }}
              key={codeForm.key('code')}
              {...codeForm.getInputProps('code')}
            />
            <Button
              type="submit"
              loading={verifyCode.isPending}
              fullWidth
              color="plum.6"
              radius="sm"
              mt="xs"
            >
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
                  c="plum.6"
                  fw={700}
                  underline="hover"
                >
                  Reenviar código
                </Anchor>
              )}
            </Text>
          </Stack>
        </form>
      )}
    </AuthSplitLayout>
  );
}
