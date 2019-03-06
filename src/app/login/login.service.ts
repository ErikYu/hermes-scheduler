import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable()
export class LoginService {
  constructor(
    private http: HttpClient,
  ) {}

  login(payload: {login: string, password: string}): Observable<any> {
    return this.http.post('/api/login', payload);
  }
}
