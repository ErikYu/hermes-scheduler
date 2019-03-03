import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ListPayload } from '../models/payload.model';
import {Observable} from 'rxjs';
import {TreeResponse} from '../models/response.model';
import {SchedulerTask} from '../models/scheduler-task.model';

@Injectable()
export class SchedulerTaskService {
  constructor(
    private http: HttpClient,
  ) {}

  getTasks(payload: ListPayload): Observable<TreeResponse<SchedulerTask>> {
    return this.http.post<TreeResponse<SchedulerTask>>('/api/scheduler/task/list', payload);
  }

}
