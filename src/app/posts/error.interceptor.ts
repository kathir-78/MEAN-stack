import { HttpErrorResponse, HttpEvent, HttpHandler, HttpHandlerFn, HttpInterceptor, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ErrorComponent } from '../error/error/error.component';



@Injectable()
export class ErrorInterceptor {

  constructor(private dialog: MatDialog) {}

  intercept(req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> {
    return next(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'unkown error occured!!'
        if(error.error.message) {
          errorMessage = error.error.message
        }
        this.dialog.open(ErrorComponent, {
          data: { message: errorMessage }
        });
        return throwError(() => error);
      })
    );
  }
}

export const errorInterceptorFn: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
  const dialog = new MatDialog(); 
  const interceptor = new ErrorInterceptor(dialog);
  return interceptor.intercept(req, next);
};