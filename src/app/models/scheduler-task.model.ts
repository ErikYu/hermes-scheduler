export interface SchedulerTask {
  id: number;
  title: string;
  content: string;
  project_id: number;
  job_type: number;
  person_id?: number;
  start_date: string;
  duration: number;
  work_hour: number;
}
