export const WorkOrderStatus = {
  PENDING: "PENDING",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
} as const;

export type WorkOrderStatusType = typeof WorkOrderStatus[keyof typeof WorkOrderStatus];

export const getStatusColor = (status: WorkOrderStatusType) => {
  switch (status) {
    case WorkOrderStatus.PENDING:
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    case WorkOrderStatus.IN_PROGRESS:
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    case WorkOrderStatus.COMPLETED:
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case WorkOrderStatus.CANCELLED:
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
  }
};

export const getStatusLabel = (status: WorkOrderStatusType) => {
  switch (status) {
    case WorkOrderStatus.PENDING:
      return "In behandeling";
    case WorkOrderStatus.IN_PROGRESS:
      return "In uitvoering";
    case WorkOrderStatus.COMPLETED:
      return "Afgerond";
    case WorkOrderStatus.CANCELLED:
      return "Geannuleerd";
    default:
      return status;
  }
};