import type { ReactNode } from 'react';
import { Menu } from '@mantine/core';
import { TEMPLATE_VARIABLES } from '../constants/templateVariables';

interface InsertVariableMenuProps {
  onSelect: (name: string) => void;
  children: ReactNode;
}

export function InsertVariableMenu({ onSelect, children }: InsertVariableMenuProps) {
  const orderVariables = TEMPLATE_VARIABLES.filter(
    (variable) => variable.group === 'order',
  );
  const conditionalVariables = TEMPLATE_VARIABLES.filter(
    (variable) => variable.group === 'conditional',
  );

  return (
    <Menu withArrow position="bottom-start">
      <Menu.Target>{children}</Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>Dados do pedido</Menu.Label>
        {orderVariables.map((variable) => (
          <Menu.Item key={variable.name} onClick={() => onSelect(variable.name)}>
            {variable.label}
          </Menu.Item>
        ))}

        <Menu.Divider />

        <Menu.Label>Avisos condicionais</Menu.Label>
        {conditionalVariables.map((variable) => (
          <Menu.Item key={variable.name} onClick={() => onSelect(variable.name)}>
            {variable.label}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
}
