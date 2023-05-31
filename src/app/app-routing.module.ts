import { SidebarComponent } from './sidebar/sidebar.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ActiveUsersComponent } from './active-users/active-users.component';
import { RunningMarketComponent } from './running-market/running-market.component';
import { MarketanaylsisComponent } from './marketanaylsis/marketanaylsis.component';
import { AddaccountComponent } from './addaccount/addaccount.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { SecurityAuthComponent } from './security-auth/security-auth.component';
import { MainComponent } from './main/main.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './services/auth.guard';

const routes: Routes = [
  {
    path:'login',
    component:LoginComponent
  },
  {
    path: '',
    component: MainComponent,canActivate:[AuthGuard],
    children: [
      { path: 'active-user', component: ActiveUsersComponent },
      { path: 'active-running-users', component: RunningMarketComponent },
      { path: 'market-analysis', component: MarketanaylsisComponent },
      { path: 'sidebar', component: SidebarComponent },
      { path: 'home', component: HomeComponent },
      { path: 'add-account', component: AddaccountComponent },
      {
        path: 'change-password',
        component: ChangePasswordComponent,
      },
      {
        path: 'security-auth',
        component: SecurityAuthComponent,
        
      },
      {
        path: 'account',
        loadChildren: () => import('./account/account.module').then((m) => m.AccountModule),
      },
      {
        path: 'report',
        loadChildren: () => import('./report/report.module').then((m) => m.ReportModule),
      },
      {
        path: 'management',
        loadChildren: () => import('./management/management.module').then((m) => m.ManagementModule),
      },
      {
        path:'messages',
        loadChildren:() => import('./messages/messages.module').then((m) => m.MessagesModule ),
      },
      {
        path:'stakesettings',
        loadChildren:() => import('./stakesettings/stakesettings.module').then((m) => m.StakesettingsModule ),
      },
      {
        path: 'settings',
        loadChildren: () =>
        import('./settings/settings.module').then((m) => m.SettingsModule),
      },

    ]
  
  },


];

@NgModule({
  imports: [RouterModule.forRoot(routes,{useHash:true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
