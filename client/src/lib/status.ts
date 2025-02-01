export const WorkOrderStatus = {
  DRAFT: "concept",
  SUBMITTED: "ingediend",
  IN_PROGRESS: "in_behandeling",
  COMPLETED: "afgerond",
  CANCELLED: "geannuleerd",
} as const;

export type WorkOrderStatusType = typeof WorkOrderStatus[keyof typeof WorkOrderStatus];

export const getStatusColor = (status: WorkOrderStatusType) => {
  switch (status) {
    case WorkOrderStatus.DRAFT:
      return "bg-gray-500";
    case WorkOrderStatus.SUBMITTED:
      return "bg-blue-500";
    case WorkOrderStatus.IN_PROGRESS:
      return "bg-yellow-500";
    case WorkOrderStatus.COMPLETED:
      return "bg-green-500";
    case WorkOrderStatus.CANCELLED:
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
};

export const getStatusLabel = (status: WorkOrderStatusType) => {
  switch (status) {
    case WorkOrderStatus.DRAFT:
      return "Concept";
    case WorkOrderStatus.SUBMITTED:
      return "Ingediend";
    case WorkOrderStatus.IN_PROGRESS:
      return "In behandeling";
    case WorkOrderStatus.COMPLETED:
      return "Afgerond";
    case WorkOrderStatus.CANCELLED:
      return "Geannuleerd";
    default:
      return status;
  }
};