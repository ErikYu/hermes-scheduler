export interface SchedulerProject {
  id: number;
  name: string;
  sub_name?: string;
  description?: string;
  deadline?: string;
  editable?: boolean;
  task_count?: number;
  finished_count?: number;
  unassigned_count?: number;
  confirmDelete?: boolean;
}
