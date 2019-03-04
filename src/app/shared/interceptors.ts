import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse
} from '@angular/common/http';

import { Observable } from 'rxjs';
import {tap} from 'rxjs/operators';

/** Pass untouched request through to the next request handler. */
@Injectable()
export class NoopInterceptor implements HttpInterceptor {
  constructor(
    private _snackBar: MatSnackBar,
  ) {}
  intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      tap((res: HttpResponse<any>) => {
        console.log('inter', res.body);
        if (res.body && res.body.meta.notice) {
          this._snackBar.open(res.body.meta.user_msg, '', {
            duration: 1000,
            verticalPosition: 'top'
          });
        }
      }, err => {
        console.log(err);
        this._snackBar.open(err.error, '', {
          duration: 2500,
          verticalPosition: 'top'
        });
      })
    );
  }
}
