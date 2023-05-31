import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TickerComponent } from './ticker/ticker.component';
import { RouterModule, Routes } from '@angular/router';
import { LogsComponent } from './logs/logs.component';
import { RulesComponent } from './rules/rules.component';

 const routes: Routes = [
  
  {
    path:'ticker',
    component:TickerComponent,
  },
  {
    path: 'logs',
    component: LogsComponent,
  },
  {
    path: 'rules',
    component: RulesComponent,
  },


 ]

@NgModule({
  declarations: [
    TickerComponent,
    LogsComponent,
    RulesComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ],
  exports:[RouterModule]

})
export class MessagesModule { }
