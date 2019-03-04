import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { GanttData } from '../models/task-gantt.model';
import { OptionsStore } from '../shared/options.store';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import {DetailResponse} from '../models/response.model';

interface Datalist<T> {
  datalist: T[];
}

interface Data<T> {
  data: T;
}

interface BaseResponse<T> {
  meta?: any;
  content: T;
}

interface HumanResource {
  id: number;
  text: string;
  parent: number;
  default?: boolean;
}

export interface OwnerOption {
  key: number;
  label: string;
  unit?: string;
}

@Injectable()
export class TaskGanttService {
  constructor(
    private _options: OptionsStore,
    private http: HttpClient,
  ) {}

  getAllOwners(): Observable<OwnerOption[]> {
    return this._options.allPerson().pipe(
      map(res => res.map(i => ({key: i.value, label: i.label})))
    );
  }

  getTasks(projectId: number): Observable<DetailResponse<GanttData>> {
    return this.http.get<DetailResponse<GanttData>>(`/api/scheduler/project/${projectId}/gantt`);
  }

  saveTasks(projectId, payload): Observable<any> {
    return this.http.put(`/api/scheduler/project/${projectId}/gantt`, payload);
  }
}
