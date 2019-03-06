import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse
} from '@angular/common/http';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';
import {tap} from 'rxjs/operators';

/** Pass untouched request through to the next request handler. */
@Injectable()
export class NoopInterceptor implements HttpInterceptor {
  constructor(
    private _snackBar: MatSnackBar,
    private _router: Router,
  ) {}
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const newReq = req.clone({setHeaders: {act: localStorage.getItem('ACT')}});
    return next.handle(newReq).pipe(
      tap((res: HttpResponse<any>) => {
        if (res.body && res.body.meta.notice) {
          this._snackBar.open(res.body.meta.user_msg, '', {
            duration: 1000,
            verticalPosition: 'top'
          });
        }
      }, err => {
        if (err.status === 401) {
          this._router.navigate(['/login']);
        }
        this._snackBar.open(err.error, '', {
          duration: 2500,
          verticalPosition: 'top'
        });
      })
    );
  }
}
