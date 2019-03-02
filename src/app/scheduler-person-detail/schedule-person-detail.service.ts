import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DetailResponse } from '../models/response.model';
import { SchedulerPerson } from '../models/scheduler-person.model';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Injectable()
export class SchedulePersonDetailService {
  constructor(
    private http: HttpClient,
  ) {}

  addPerson(payload) {
    return this.http.post('/api/scheduler/person', payload);
  }

  updatePerson(id: number, payload) {
    return this.http.put(`/api/scheduler/person/${id}`, payload);
  }

  getPerson(id: number): Observable<SchedulerPerson> {
    return this.http.get<DetailResponse<SchedulerPerson>>(`/api/scheduler/person/${id}`).pipe(
      map(i => i.content.data)
    );
  }
}
