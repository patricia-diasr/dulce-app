import { createTheme, type MantineThemeOverride } from '@mantine/core';
import {
  accepted,
  canceled,
  caramel,
  cocoa,
  lilac,
  pending,
  plum,
  rejected,
} from './colors';

export const theme: MantineThemeOverride = createTheme({
  primaryColor: 'plum',
  primaryShade: 5,

  colors: {
    plum,
    lilac,
    caramel,
    cocoa,
    pending,
    accepted,
    rejected,
    canceled,
  },

  fontFamily: '"Nunito Sans", sans-serif',
  fontFamilyMonospace: 'ui-monospace, SFMono-Regular, monospace',
  headings: {
    fontFamily: '"Fraunces", serif',
    fontWeight: '600',
  },

  defaultRadius: 'md',

  radius: {
    xs: '4px',
    sm: '6px',
    md: '10px',
    lg: '14px',
    xl: '20px',
  },

  shadows: {
    xs: '0 1px 3px rgba(74, 52, 42, 0.06)',
    sm: '0 2px 8px rgba(74, 52, 42, 0.08)',
    md: '0 4px 14px rgba(74, 52, 42, 0.10)',
    lg: '0 8px 24px rgba(74, 52, 42, 0.12)',
    xl: '0 12px 32px rgba(74, 52, 42, 0.14)',
  },

  components: {
    Button: {
      defaultProps: {
        radius: 'md',
      },
    },
    Card: {
      defaultProps: {
        radius: 'md',
        shadow: 'sm',
        withBorder: true,
      },
    },
    Paper: {
      defaultProps: {
        radius: 'md',
      },
    },
    Modal: {
      defaultProps: {
        radius: 'md',
        shadow: 'lg',
        centered: true,
      },
    },
    TextInput: {
      defaultProps: {
        radius: 'md',
      },
    },
    Select: {
      defaultProps: {
        radius: 'md',
      },
    },
    Textarea: {
      defaultProps: {
        radius: 'md',
      },
    },
    Badge: {
      defaultProps: {
        radius: 'sm',
      },
    },
    NumberInput: {
      defaultProps: {
        radius: 'md',
      },
    },
  },
});
