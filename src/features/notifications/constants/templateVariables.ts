export interface TemplateVariable {
  name: string;
  label: string;
  description: string;
  group: 'order' | 'conditional';
}

export const TEMPLATE_VARIABLES: TemplateVariable[] = [
  {
    name: 'customerName',
    label: 'Nome do cliente',
    description: 'Nome do cliente que fez o pedido.',
    group: 'order',
  },
  {
    name: 'orderId',
    label: 'Número do pedido',
    description: 'Número de identificação do pedido.',
    group: 'order',
  },
  {
    name: 'orderStatus',
    label: 'Status atual do pedido',
    description:
      'Status atual, já traduzido (Pendente, Aceito, Recusado, Cancelado ou Concluído).',
    group: 'order',
  },
  {
    name: 'pickupDate',
    label: 'Data de retirada',
    description: 'Data de retirada do pedido.',
    group: 'order',
  },
  {
    name: 'pickupTime',
    label: 'Hora de retirada',
    description: 'Horário de retirada do pedido.',
    group: 'order',
  },
  {
    name: 'orderTotal',
    label: 'Valor total do pedido',
    description: 'Valor total do pedido, já com desconto aplicado.',
    group: 'order',
  },
  {
    name: 'orderItems',
    label: 'Lista completa dos bolos',
    description:
      'Lista com todos os bolos do pedido — gerada automaticamente, não precisa editar.',
    group: 'order',
  },
  {
    name: 'paymentStatus',
    label: 'Status do pagamento',
    description: 'Situação financeira atual: Pendente, Parcial ou Pago.',
    group: 'order',
  },
  {
    name: 'amountPaid',
    label: 'Valor pago até o momento',
    description: 'Soma dos pagamentos já registrados para este pedido.',
    group: 'order',
  },
  {
    name: 'discountNotice',
    label: 'Aviso de desconto',
    description:
      'Frase pronta avisando sobre o desconto aplicado — some sozinha se não houver desconto.',
    group: 'conditional',
  },
  {
    name: 'orderNotesNotice',
    label: 'Observações do pedido',
    description: 'Mostra as observações do pedido — some sozinha se estiver vazio.',
    group: 'conditional',
  },
  {
    name: 'refundNotice',
    label: 'Aviso de valor a devolver',
    description:
      'Só aparece em pedidos cancelados ou recusados com pagamento já registrado.',
    group: 'conditional',
  },
];

export const TEMPLATE_VARIABLE_NAMES = TEMPLATE_VARIABLES.map(
  (variable) => variable.name,
);

export function getVariableLabel(name: string): string {
  return TEMPLATE_VARIABLES.find((variable) => variable.name === name)?.label ?? name;
}
