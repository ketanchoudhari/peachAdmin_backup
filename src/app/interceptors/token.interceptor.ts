import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
}from '@angular/common/http';
import { TokenService } from '../services/token.service';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonService } from '../services/models/common.service';
import { Observable, map } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService  implements HttpInterceptor   {
  apisCalled: boolean = false;


  constructor(
    private tokenService: TokenService,
    private router: Router,
    private toastr: ToastrService,
    private authService: AuthService,
    private commonService: CommonService
  ) { }

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (request.url.match(/all_apis\//)) {
      return next.handle(request);
    }
    if (!request.url.includes('login')) {
      let req = request.clone({
        setHeaders: { Authorization: this.tokenService.get() },
      });
      return next.handle(req).pipe(
        map((event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            if (event.body && (event.body.errorDescription?.toLowerCase() ===
                  'session expired' ||
              event.body.errorDescription?.toLowerCase() === 'no session')
            ) {
              this.tokenService.delete();
              if (this.authService.currentAuthState !== false) {
                this.router.navigateByUrl('/login');
                this.authService.setLoggedIn(false);
                this.toastr.error(event.body.errorDescription);
              }
            }
          }
          return event;
        })
      );
    }
    return next.handle(request);
  }
}
