import type { FocusEventHandler } from 'react';
import { InputBase, type InputBaseProps } from '@mantine/core';
import { IMaskInput } from 'react-imask';

const PHONE_MASK = ['(00) 0000-0000', '(00) 00000-0000'];

interface PhoneInputProps extends InputBaseProps {
  value?: string;
  onChange?: (event: { target: { value: string } }) => void;
  onBlur?: FocusEventHandler<HTMLInputElement>;
  name?: string;
  placeholder?: string;
}

export function PhoneInput(props: PhoneInputProps) {
  return <InputBase component={IMaskInput} mask={PHONE_MASK} {...props} />;
}
