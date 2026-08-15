import type { MantineColorsTuple } from '@mantine/core';

export const plum: MantineColorsTuple = [
  '#f5f3f6',
  '#e8e5ec',
  '#d3cbdd',
  '#baa7cd',
  '#9d83b9',
  '#8363a7',
  '#725393',
  '#5d4479',
  '#493460',
  '#332442',
];

export const lilac: MantineColorsTuple = [
  '#f6f3f7',
  '#eae3ed',
  '#d8c7e0',
  '#c4a0d4',
  '#ac79c3',
  '#9656b3',
  '#83479e',
  '#6c3a82',
  '#552c68',
  '#3b1f47',
];

export const caramel: MantineColorsTuple = [
  '#f7f5f3',
  '#ece8e4',
  '#dfd4c9',
  '#d1baa3',
  '#bf9e7d',
  '#ae855b',
  '#9a734c',
  '#7e5e3e',
  '#644a30',
  '#453321',
];

export const cocoa: MantineColorsTuple = [
  '#f6f4f3',
  '#ece7e5',
  '#ddd0cb',
  '#cdb3a7',
  '#b99483',
  '#a67863',
  '#926753',
  '#785544',
  '#5f4235',
  '#422d24',
];

export const pending: MantineColorsTuple = [
  '#f9f6f1',
  '#f0ebe0',
  '#e9dabe',
  '#e8c88c',
  '#dfb25e',
  '#d69d33',
  '#bf8a26',
  '#9d711f',
  '#7e5a16',
  '#573e0f',
];

export const accepted: MantineColorsTuple = [
  '#f4f6f4',
  '#e7eae6',
  '#d2d8cf',
  '#b6c3b1',
  '#98ab91',
  '#7d9574',
  '#6c8263',
  '#596b52',
  '#455440',
  '#303a2c',
];

export const rejected: MantineColorsTuple = [
  '#f7f3f3',
  '#ede3e3',
  '#e0c7c7',
  '#d59f9f',
  '#c47878',
  '#b55454',
  '#a04646',
  '#833939',
  '#682b2b',
  '#481e1e',
];

export const canceled: MantineColorsTuple = [
  '#f5f5f5',
  '#e8e8e8',
  '#d4d4d4',
  '#bababa',
  '#9e9e9e',
  '#858585',
  '#737373',
  '#5e5e5e',
  '#4a4a4a',
  '#333333',
];

export const creamBackground = '#FBF7F4';

export const orderStatusColor = {
  PENDENTE: 'pending',
  ACEITO: 'accepted',
  RECUSADO: 'rejected',
  CANCELADO: 'canceled',
  CONCLUIDO: 'plum',
} as const;
