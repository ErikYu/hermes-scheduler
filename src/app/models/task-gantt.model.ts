export interface Task {
  id: number;
  start_date: string;
  end_date?: string;
  text: string;
  detail?: string;
  progress?: number;
  duration: number;
  parent?: number;
  open?: boolean;
  owner?: {
    resource_id: string;
    value: string;
  }[];
}

export interface Link {
  id: number;
  source: number;
  target: number;
  type: string;
}



export interface GanttData {
  data: Task[];
  links: Link[];
}
