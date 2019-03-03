import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable} from 'rxjs';
import {DetailResponse} from '../models/response.model';

@Injectable()
export class SchedulerProjectDetailService {
  constructor(
    private http: HttpClient,
  ) {}

  addProject(payload): Observable<DetailResponse<number>> {
    return this.http.post<DetailResponse<number>>('/api/scheduler/project', payload);
  }

  updateProject(id: number, payload): Observable<DetailResponse<number>> {
    return this.http.put<DetailResponse<number>>(`/api/scheduler/project/${id}`, payload);
  }
}
