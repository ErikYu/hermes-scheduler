import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TreeResponse } from '../models/response.model';
import {filter, map} from 'rxjs/operators';
import {of} from 'rxjs';

@Injectable()
export class OptionsStore {
  constructor(
    private http: HttpClient,
  ) {}
  allPerson() {
    // if (localStorage.getItem('allPerson')) {
    //   return of(JSON.parse(localStorage.getItem('allPerson')));
    // } else {
      return this.http.get<TreeResponse<any>>('/api/scheduler/options/person').pipe(
        map(res => {
          localStorage.setItem('allPerson', JSON.stringify(res.content.datalist));
          return res.content.datalist;
        })
      );
    // }
  }

  allPersonByProject(projectId: number) {
    return this.http.get<TreeResponse<any>>(`/api/scheduler/project/${projectId}/person`).pipe(
      map(res => res.content.datalist)
    );
  }

  allTaskInProject(projectId: number, taskId: number) {
    return this.http.get<TreeResponse<any>>(`/api/scheduler/project/${projectId}/task`).pipe(
      map(res => res.content.datalist.filter(i => i.value !== taskId)),
    );
  }
}
