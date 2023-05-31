import { APP_INITIALIZER, ErrorHandler, LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HeaderComponent } from './header/header.component';
import { ActiveUsersComponent } from './active-users/active-users.component';
import { RunningMarketComponent } from './running-market/running-market.component';
import { MarketanaylsisComponent } from './marketanaylsis/marketanaylsis.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { AddaccountComponent } from './addaccount/addaccount.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { SecurityAuthComponent } from './security-auth/security-auth.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDatepickerModule, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MainComponent } from './main/main.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component';
import { CookieService } from 'ngx-cookie-service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { PipesModule } from './pipes/pipes.module';
import { RemoveSpacePipe } from './pipes/remove-space.pipe';
import { TitleCasePipe } from '@angular/common';
import { TokenInterceptorService } from './interceptors/token.interceptor';
import { GlobalErrorHandler } from './GlobalErrorHandler/GlobalErrorHandler';
import { EnvService } from './env.service';
import { DirectivesModule } from './directives/directives.module';
import { NgxPaginationModule } from 'ngx-pagination';




@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HeaderComponent,
    ActiveUsersComponent,
    RunningMarketComponent,
    MarketanaylsisComponent,
    SidebarComponent,
    AddaccountComponent,
    ChangePasswordComponent,
    SecurityAuthComponent,
    MainComponent,
    HomeComponent,
  ],

  
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    PipesModule,
    DirectivesModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    ModalModule.forRoot(),
    BsDatepickerModule.forRoot(),
    BrowserAnimationsModule,
    HttpClientModule,
    ToastrModule.forRoot(),

  ],
  
  providers: [HttpClientModule, CookieService,
    // BreadcrumbsService,
    TitleCasePipe,
    RemoveSpacePipe,
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptorService, multi: true },
    { provide: LOCALE_ID, useValue: 'en-IN' },
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    // { provide: DEFAULT_CURRENCY_CODE, useValue: 'INR' },
    {
      provide: APP_INITIALIZER,
      useFactory: (envService: EnvService) => () => envService.init(),
      deps: [EnvService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
