import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';


export const authInterceptor: HttpInterceptorFn = 
( req: HttpRequest<any>,
  next: HttpHandlerFn ) => {

    const token  = localStorage.getItem('token')
    console.log(token);

    if(token) {
      const  clonedRequest = req.clone({
        setHeaders : {
          'Authorization': 'Bearer ' + token
        }
      });
        return next(clonedRequest);
    }

    return next(req)
};
