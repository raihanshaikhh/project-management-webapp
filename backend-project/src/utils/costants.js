export const UserRolesEnum = {
  ADMIN: "admin",
  PROJECT_ADMIN: "project_admin",
  MEMBER: "member",
};

export const AvailableUserRole = Object.values(UserRolesEnum);

export const TaskStatusEnum = {
  todo: "todo",
  in_progress: "in_progress",
  done: "done",
};

export const AvailableTaskStatus = Object.values(TaskStatusEnum);


export const TaskPriority = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
  URGENT: "URGENT",
};
export const Priority = Object.values(TaskPriority);
