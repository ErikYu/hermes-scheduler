import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable} from 'rxjs';
import {finalize} from 'rxjs/operators';
import {Router} from '@angular/router';

@Injectable()
export class LoginService {
  constructor(
    private http: HttpClient,
    private _router: Router,
  ) {}

  login(payload: {login: string, password: string}): Observable<any> {
    return this.http.post('/api/login', payload);
  }

  signOut() {
    return this.http.get('/api/login/out').pipe(
      finalize(() => {
        this._router.navigate(['/login']);
      })
    );
  }
}
