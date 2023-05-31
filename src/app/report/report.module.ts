import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DownlineComponent } from './downline/downline.component';
import { MarketComponent } from './market/market.component';
import { AllCasinoComponent } from './all-casino/all-casino.component';
import { DiamondCasinoComponent } from './diamond-casino/diamond-casino.component';
import { SnCasinoComponent } from './sn-casino/sn-casino.component';
import { SlotcasinoComponent } from './slotcasino/slotcasino.component';
import { BetgamesComponent } from './betgames/betgames.component';
import { AwcComponent } from './awc/awc.component';
import { PokerComponent } from './poker/poker.component';
import { LogInoutComponent } from './log-inout/log-inout.component';
import { RecentAccountComponent } from './recent-account/recent-account.component';
import { RouterModule, Routes } from '@angular/router';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ReportComponent } from './report.component';
import { DpDatePickerModule } from 'ng2-date-picker';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbAlertModule, NgbNavModule, NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';
import { PipesModule } from "../pipes/pipes.module";


const routes: Routes = [
  {
    path: '',
    component: ReportComponent,
  },
  {
    path:'pl-downline',
    component:DownlineComponent
  },
  {
    path:'pl-market',
    component:MarketComponent
  },
  {
    path:'pnl-downline',
    component:AllCasinoComponent
  },
  {
    path:'pl-dicasino',
    component:DiamondCasinoComponent
  },
  {
    path:'pl-sncasino',
    component:SnCasinoComponent
  },
  {
    path:'pl-slotcasino',
    component:SlotcasinoComponent
  },
  {
    path:'pl-betgames',
    component:BetgamesComponent
  },
  {
    path:'pl-pokerlog',
    component:PokerComponent
  },
  {
    path:'pl-awccasino',
    component:AwcComponent
  },
  {
    path:'loginlogout',
    component:LogInoutComponent
  },
  {
    path:'new-accounts',
    component:RecentAccountComponent
  }
];

@NgModule({
    declarations: [
        DownlineComponent,
        MarketComponent,
        AllCasinoComponent,
        DiamondCasinoComponent,
        SnCasinoComponent,
        SlotcasinoComponent,
        BetgamesComponent,
        AwcComponent,
        PokerComponent,
        LogInoutComponent,
        RecentAccountComponent,
    ],
    exports: [RouterModule],
    imports: [
        CommonModule,
        ModalModule,
        FormsModule,
        BsDatepickerModule.forRoot(),
        RouterModule.forChild(routes),
        NgSelectModule,
        NgbNavModule,
        NgbAlertModule,
        NgbTimepickerModule,
        NgxPaginationModule,
        PipesModule
    ]
})
export class ReportModule { }
