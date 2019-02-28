import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

interface Datalist<T> {
  datalist: T[];
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


@Injectable()
export class GantterService {
  constructor() {}
  getResource(): Observable<BaseResponse<Datalist<HumanResource>>> {
    return of({
      content: {
        datalist: [
          { id: 1, text: 'QA', parent: null },
          { id: 2, text: 'Development', parent: null },
          { id: 3, text: 'Sales', parent: null },
          { id: 4, text: 'Other', parent: null },
          { id: 5, text: 'Unassigned', parent: 4, default: true },
          { id: 6, text: 'John', parent: 1 },
          { id: 7, text: 'Mike', parent: 2 },
          { id: 8, text: 'Anna', parent: 2 },
          { id: 9, text: 'Bill', parent: 3 },
          { id: 10, text: 'Floe', parent: 3 }
        ]
      }
    });
  }
}
