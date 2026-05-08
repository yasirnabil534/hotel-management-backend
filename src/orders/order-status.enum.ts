export enum OrderStatus {
  PENDING = 'pending',
  RECEIVED = 'received',
  IN_PROGRESS = 'in_progress',
  DONE = 'done',
}

export const ORDER_STATUS_FLOW: OrderStatus[] = [
  OrderStatus.PENDING,
  OrderStatus.RECEIVED,
  OrderStatus.IN_PROGRESS,
  OrderStatus.DONE,
];

export const ORDER_STATUS_OPTIONS = ORDER_STATUS_FLOW.map((status, index) => ({
  step: index + 1,
  value: status,
  label: status
    .split('_')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' '),
}));

export function normalizeOrderStatus(status?: string): OrderStatus | undefined {
  if (!status) {
    return undefined;
  }

  const normalizedStatus = status
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_') as OrderStatus;
  return ORDER_STATUS_FLOW.includes(normalizedStatus)
    ? normalizedStatus
    : undefined;
}
