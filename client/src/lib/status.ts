export const WorkOrderStatus = {
  DRAFT: "draft",
  SUBMITTED: "submitted",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
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
      return "Draft";
    case WorkOrderStatus.SUBMITTED:
      return "Submitted";
    case WorkOrderStatus.IN_PROGRESS:
      return "In Progress";
    case WorkOrderStatus.COMPLETED:
      return "Completed";
    case WorkOrderStatus.CANCELLED:
      return "Cancelled";
    default:
      return status;
  }
};
