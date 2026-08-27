import { Box, Paper, Text, Title } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import type { ReactNode } from 'react';
import { creamBackground, textColor } from '@/theme/colors';
import { MAX_CONTENT_WIDTH } from '@/theme/layout';

interface AuthSplitLayoutProps {
  heading: string;
  description: string;
  illustrationSrc: string;
  illustrationAlt: string;
  formTitle: string;
  formSubtitle: string;
  children: ReactNode;
}

export function AuthSplitLayout({
  heading,
  description,
  illustrationSrc,
  illustrationAlt,
  formTitle,
  formSubtitle,
  children,
}: AuthSplitLayoutProps) {
  const isMobile = useMediaQuery('(max-width: 900px)');

  return (
    <Box
      style={{
        width: '100%',
        minHeight: '100dvh',
        backgroundColor: creamBackground,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: isMobile ? 16 : 32,
      }}
    >
      <Box
        style={{
          width: isMobile ? '100%' : 'fit-content',
          maxWidth: MAX_CONTENT_WIDTH,
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: 'center',
          gap: 0,
        }}
      >
        <Box
          style={{
            width: 'auto',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'flex-start',
            paddingBlock: isMobile ? 16 : 32,
            paddingInline: isMobile ? 16 : 32,
          }}
        >
          <Title order={1} fz={44} fw={700} lh={1.15} c={textColor} maw={520}>
            {heading}
          </Title>

          <Text size="lg" c={textColor} mt="md" maw={460}>
            {description}
          </Text>

          <Box
            mt={48}
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <img
              src={illustrationSrc}
              alt={illustrationAlt}
              style={{
                display: 'block',
                width: '100%',
                maxWidth: '520px',
                maxHeight: '360px',
                objectFit: 'contain',
              }}
            />
          </Box>
        </Box>

        <Box
          style={{
            width: isMobile ? '100%' : 'fit-content',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            paddingBlock: isMobile ? 4 : 32,
            paddingInline: isMobile ? 4 : 32,
          }}
        >
          <Paper
            radius="md"
            shadow="md"
            p="xl"
            style={{
              width: 460,
              maxWidth: '100%',
              backgroundColor: '#FEFEFE',
            }}
          >
            <Box my={10}>
              <Title mt={2} order={2} fz={28} fw={700} c={textColor}>
                {formTitle}
              </Title>

              <Text c={textColor} opacity={0.75} size="sm" mt={4} mb="lg">
                {formSubtitle}
              </Text>
              {children}
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}
