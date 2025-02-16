import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { authInterceptor } from './app/posts/auth.interceptor';
import { errorInterceptorFn } from './app/posts/error.interceptor';


bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(
      withInterceptors([authInterceptor, errorInterceptorFn]),  // add the interceptor
    ),   //enables HTTP capabilities
    provideAnimationsAsync() , // enables Angular animations
    provideRouter(routes)   //enables routing
  ]
})
  .catch((err) => console.error(err));
