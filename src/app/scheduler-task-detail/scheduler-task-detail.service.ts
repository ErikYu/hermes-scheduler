import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable} from 'rxjs';
import {SchedulerTask} from '../models/scheduler-task.model';
import {DetailResponse} from '../models/response.model';
import {map} from 'rxjs/operators';

@Injectable()
export class SchedulerTaskDetailService {
  constructor(
    private http: HttpClient,
  ) {}

  addSchedulerTask(payload) {
    return this.http.post('/api/scheduler/task', payload);
  }

  updateSchedulerTask(id: number, payload): Observable<DetailResponse<number>> {
    return this.http.put<DetailResponse<number>>(`/api/scheduler/task/${id}`, payload);
  }

  getSchedulerTask(id: number): Observable<SchedulerTask> {
    return this.http.get<DetailResponse<SchedulerTask>>(`/api/scheduler/task/${id}`).pipe(
      map(res => res.content.data)
    );
  }
}
