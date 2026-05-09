export enum OrderStatus {
  PENDING = 'pending',
  RECEIVED = 'received',
  IN_PROGRESS = 'in_progress',
  DONE = 'done',
  CANCELLED = 'cancelled',
}

/** The normal forward-progression flow (excludes terminal states like CANCELLED). */
export const ORDER_STATUS_FLOW: OrderStatus[] = [
  OrderStatus.PENDING,
  OrderStatus.RECEIVED,
  OrderStatus.IN_PROGRESS,
  OrderStatus.DONE,
];

/** All valid order statuses including terminal states. */
export const ALL_ORDER_STATUSES: OrderStatus[] = [
  ...ORDER_STATUS_FLOW,
  OrderStatus.CANCELLED,
];

/** Statuses from which an order can still be cancelled. */
export const CANCELLABLE_STATUSES: OrderStatus[] = [
  OrderStatus.PENDING,
  OrderStatus.RECEIVED,
  OrderStatus.IN_PROGRESS,
];

export const ORDER_STATUS_OPTIONS = ALL_ORDER_STATUSES.map(
  (status, index) => ({
    step: index + 1,
    value: status,
    label: status
      .split('_')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' '),
  }),
);

export function normalizeOrderStatus(
  status?: string,
): OrderStatus | undefined {
  if (!status) {
    return undefined;
  }

  const normalizedStatus = status
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_') as OrderStatus;
  return ALL_ORDER_STATUSES.includes(normalizedStatus)
    ? normalizedStatus
    : undefined;
}
