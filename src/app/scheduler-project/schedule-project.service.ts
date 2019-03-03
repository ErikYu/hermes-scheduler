import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ListPayload } from '../models/payload.model';
import {Observable} from 'rxjs';
import {DetailResponse, TreeResponse} from '../models/response.model';
import {SchedulerProject} from '../models/scheduler-project.model';

@Injectable()
export class ScheduleProjectService {
  constructor(
    private http: HttpClient,
  ) {}

  getAllProjects(payload: ListPayload): Observable<TreeResponse<SchedulerProject>> {
    return this.http.post<TreeResponse<SchedulerProject>>('/api/scheduler/project/list', payload);
  }

  deleteProject(id: number): Observable<DetailResponse<number>> {
    return this.http.delete<DetailResponse<number>>(`/api/scheduler/project/${id}`);
  }
}
