import { Select } from '@mantine/core';

interface PickupTimeSelectProps {
  value: string;
  onChange: (value: string) => void;
  availableTimes: string[];
  disabled?: boolean;
}

export function PickupTimeSelect({
  value,
  onChange,
  availableTimes,
  disabled,
}: PickupTimeSelectProps) {
  return (
    <Select
      label="Hora"
      placeholder="Selecione o horário"
      data={availableTimes}
      value={availableTimes.includes(value) ? value : null}
      onChange={(newValue) => newValue && onChange(newValue)}
      disabled={disabled || availableTimes.length === 0}
      searchable
      nothingFoundMessage="Nenhum horário disponível"
    />
  );
}
