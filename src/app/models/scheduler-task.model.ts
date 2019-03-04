export interface SchedulerTask {
  id: number;
  title: string;
  content: string;
  project_id: number;
  person_name: string;
  job_type: number;
  job_type_value: string;
  person_id?: number;
  start_date: string;
  duration: number;
  work_hour: number;
  depend_id: number;
}
