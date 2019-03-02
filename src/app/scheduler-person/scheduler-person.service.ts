import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { TreeResponse } from '../models/response.model';
import { SchedulerPerson } from '../models/scheduler-person.model';

interface ListPayload {
  limit: number;
  page: number;
  where: any;
}

@Injectable()
export class SchedulerPersonService {
  constructor(
    private http: HttpClient,
  ) {}
  getPeopleList(payload: ListPayload): Observable<TreeResponse<SchedulerPerson>> {
    return this.http.post<TreeResponse<SchedulerPerson>>('/api/scheduler/person/list', payload);
  }

  deletePerson(id: number) {
    return this.http.delete(`/api/scheduler/person/${id}`);
  }
}
