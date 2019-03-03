import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class SchedulerTaskDetailService {
  constructor(
    private http: HttpClient,
  ) {}

  addSchedulerTask(payload) {
    return this.http.post('/api/scheduler/task', payload);
  }
}
